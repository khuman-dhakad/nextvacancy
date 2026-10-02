package com.nextvacancy.api.auth;

import java.time.OffsetDateTime;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int MAX_AUTH_REQUESTS_PER_MINUTE = 5;
    private static final int MAX_IP_REQUESTS_PER_MINUTE = 30;
    private static final long ACCOUNT_LOCK_MINUTES = 15;
    private static final long RESET_TOKEN_MINUTES = 60;
    private static final long VERIFICATION_TOKEN_HOURS = 24;
    private static final String DUMMY_PASSWORD_HASH =
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder(12)
                    .encode("non-existent-account-password");

    private final UserRepository users;
    private final AuthSessionRepository sessions;
    private final LegacySessionRepository legacySessions;
    private final PasswordService passwords;
    private final AuthTokenService tokens;
    private final AuthRateLimitService rateLimits;
    private final String adminUsername;
    private final String adminEmail;
    private final String adminPasswordHash;

    public AuthenticationService(
            UserRepository users,
            AuthSessionRepository sessions,
            LegacySessionRepository legacySessions,
            PasswordService passwords,
            AuthTokenService tokens,
            AuthRateLimitService rateLimits,
            @Value("${app.admin.username}") String adminUsername,
            @Value("${app.admin.email}") String adminEmail,
            @Value("${app.admin.password-hash}") String adminPasswordHash) {
        this.users = users;
        this.sessions = sessions;
        this.legacySessions = legacySessions;
        this.passwords = passwords;
        this.tokens = tokens;
        this.rateLimits = rateLimits;
        this.adminUsername = adminUsername;
        this.adminEmail = adminEmail;
        this.adminPasswordHash = adminPasswordHash;
        if (adminUsername.isBlank() || adminEmail.isBlank() || adminPasswordHash.isBlank()) {
            throw new IllegalStateException("ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD_HASH are required.");
        }
    }

    @Transactional
    public CreatedCandidate register(RegistrationRequest request, String clientIp) {
        String email = normalize(request.email());
        enforceRateLimit("register-email:" + email, MAX_AUTH_REQUESTS_PER_MINUTE);
        enforceRateLimit("register-ip:" + normalizeIp(clientIp), MAX_IP_REQUESTS_PER_MINUTE);
        if (users.findByEmailIgnoreCase(email).isPresent()) {
            throw new AccountConflictException();
        }
        String passwordError = passwordPolicyError(request.password());
        if (passwordError != null) {
            throw new IllegalArgumentException(passwordError);
        }
        OffsetDateTime now = OffsetDateTime.now();
        String rawVerificationToken = tokens.newRefreshToken();
        UserEntity user = new UserEntity(
                "user-" + tokens.newSessionId(), request.fullName().trim(), email,
                request.mobile().replaceAll("\\D", ""), passwords.hash(request.password()));
        user.setEmailVerificationTokenHash(tokens.hashToken(rawVerificationToken));
        user.setEmailVerificationTokenExpiresAt(now.plusHours(VERIFICATION_TOKEN_HOURS));
        try {
            users.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AccountConflictException();
        }
        return new CreatedCandidate(AuthUserResponse.from(user), rawVerificationToken);
    }

    @Transactional(noRollbackFor = BadCredentialsException.class)
    public IssuedSession login(String emailInput, String password, String clientIp) {
        String email = normalize(emailInput);
        enforceRateLimit("login-email:" + email, MAX_AUTH_REQUESTS_PER_MINUTE);
        enforceRateLimit("login-ip:" + normalizeIp(clientIp), MAX_IP_REQUESTS_PER_MINUTE);
        UserEntity user = users.findByEmailIgnoreCaseForUpdate(email)
                .filter(candidate -> "CANDIDATE".equals(candidate.getRole()))
                .orElse(null);
        if (user == null) {
            passwords.matches(password, DUMMY_PASSWORD_HASH);
            throw new BadCredentialsException("Invalid email or password.");
        }
        OffsetDateTime now = OffsetDateTime.now();
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(now)) {
            throw new AccountLockedException();
        }
        if (!passwords.matches(password, user.getPasswordHash())) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            user.setLockedUntil(attempts >= MAX_LOGIN_ATTEMPTS ? now.plusMinutes(ACCOUNT_LOCK_MINUTES) : null);
            user.setUpdatedAt(now);
            users.save(user);
            throw new BadCredentialsException("Invalid email or password.");
        }
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setUpdatedAt(now);
        if (passwords.needsUpgrade(user.getPasswordHash())) {
            user.setPasswordHash(passwords.hash(password));
        }
        users.save(user);
        rateLimits.clear("login-email:" + email);
        return issueSession(user.getId(), user.getRole(), AuthUserResponse.from(user));
    }

    @Transactional
    public IssuedSession loginAdmin(String identifier, String password, String clientIp) {
        String normalizedIdentifier = normalize(identifier);
        enforceRateLimit("admin-login:" + normalizedIdentifier, MAX_AUTH_REQUESTS_PER_MINUTE);
        enforceRateLimit("admin-login-ip:" + normalizeIp(clientIp), MAX_IP_REQUESTS_PER_MINUTE);
        boolean identifierMatches = normalizedIdentifier.equals(normalize(adminUsername))
                || normalizedIdentifier.equals(normalize(adminEmail));
        if (!identifierMatches || !passwords.matches(password, adminPasswordHash)) {
            throw new BadCredentialsException("Invalid email or password.");
        }
        rateLimits.clear("admin-login:" + normalizedIdentifier);
        return issueSession("admin:" + adminUsername, "ADMIN", null);
    }

    @Transactional
    public IssuedSession refresh(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new BadCredentialsException("The refresh session is invalid or expired.");
        }
        AuthSessionEntity session = sessions.findActiveByRefreshHashForUpdate(tokens.hashToken(rawRefreshToken),
                        OffsetDateTime.now())
                .orElseThrow(() -> new BadCredentialsException("The refresh session is invalid or expired."));
        String newRefreshToken = tokens.newRefreshToken();
        session.setRefreshTokenHash(tokens.hashToken(newRefreshToken));
        session.setExpiresAt(OffsetDateTime.now().plusSeconds(tokens.getRefreshTtlSeconds()));
        sessions.save(session);

        AuthUserResponse user = null;
        if ("CANDIDATE".equals(session.getRole())) {
            user = users.findById(session.getPrincipalId())
                    .filter(candidate -> "CANDIDATE".equals(candidate.getRole()))
                    .map(AuthUserResponse::from)
                    .orElseThrow(() -> new BadCredentialsException("The refresh session is invalid or expired."));
        }
        return new IssuedSession(session.getPrincipalId(), session.getRole(), session.getId(), newRefreshToken, user);
    }

    @Transactional
    public void logout(String sessionId, String rawRefreshToken) {
        OffsetDateTime now = OffsetDateTime.now();
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            sessions.findByRefreshHashForUpdate(tokens.hashToken(rawRefreshToken)).ifPresent(session -> {
                session.setRevokedAt(now);
                sessions.save(session);
            });
        }
        sessions.findById(sessionId).ifPresent(session -> {
            if (session.getRevokedAt() == null) {
                session.setRevokedAt(now);
                sessions.save(session);
            }
        });
    }

    @Transactional(readOnly = true)
    public AuthUserResponse currentUser(String principalId, String role) {
        if (!"CANDIDATE".equals(role)) {
            throw new IllegalArgumentException("Only candidate profiles are available from this endpoint.");
        }
        return users.findById(principalId)
                .filter(user -> role.equals(user.getRole()))
                .map(AuthUserResponse::from)
                .orElseThrow(() -> new BadCredentialsException("The account is unavailable."));
    }

    @Transactional
    public String createPasswordResetToken(String emailInput, String clientIp) {
        String email = normalize(emailInput);
        enforceRateLimit("password-reset:" + email, MAX_AUTH_REQUESTS_PER_MINUTE);
        enforceRateLimit("password-reset-ip:" + normalizeIp(clientIp), MAX_IP_REQUESTS_PER_MINUTE);
        UserEntity user = users.findByEmailIgnoreCase(email)
                .filter(candidate -> "CANDIDATE".equals(candidate.getRole()))
                .orElse(null);
        if (user == null) {
            return null;
        }
        String token = tokens.newRefreshToken();
        user.setPasswordResetTokenHash(tokens.hashToken(token));
        user.setPasswordResetTokenExpiresAt(OffsetDateTime.now().plusMinutes(RESET_TOKEN_MINUTES));
        user.setUpdatedAt(OffsetDateTime.now());
        users.save(user);
        return token;
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        String passwordError = passwordPolicyError(newPassword);
        if (passwordError != null) {
            throw new IllegalArgumentException(passwordError);
        }
        UserEntity user = users.findValidPasswordResetTokenForUpdate(
                        tokens.hashToken(rawToken), OffsetDateTime.now())
                .orElseThrow(() -> new InvalidTokenException());
        user.setPasswordHash(passwords.hash(newPassword));
        user.setPasswordResetTokenHash(null);
        user.setPasswordResetTokenExpiresAt(null);
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setUpdatedAt(OffsetDateTime.now());
        users.save(user);
        sessions.revokeActiveByPrincipalId(user.getId(), OffsetDateTime.now());
        legacySessions.deleteAllByUserId(user.getId());
    }

    @Transactional
    public void verifyEmail(String rawToken) {
        UserEntity user = users.findValidVerificationTokenForUpdate(
                        tokens.hashToken(rawToken), OffsetDateTime.now())
                .orElseThrow(() -> new InvalidTokenException());
        user.setEmailVerified(true);
        user.setEmailVerificationTokenHash(null);
        user.setEmailVerificationTokenExpiresAt(null);
        user.setUpdatedAt(OffsetDateTime.now());
        users.save(user);
    }

    @Transactional
    public String createVerificationToken(String principalId) {
        enforceRateLimit("verification-resend:" + principalId, MAX_AUTH_REQUESTS_PER_MINUTE);
        UserEntity user = users.findById(principalId)
                .filter(candidate -> "CANDIDATE".equals(candidate.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Candidate account was not found."));
        if (user.isEmailVerified()) {
            throw new IllegalArgumentException("This email address is already verified.");
        }
        String token = tokens.newRefreshToken();
        user.setEmailVerificationTokenHash(tokens.hashToken(token));
        user.setEmailVerificationTokenExpiresAt(OffsetDateTime.now().plusHours(VERIFICATION_TOKEN_HOURS));
        user.setUpdatedAt(OffsetDateTime.now());
        users.save(user);
        return token;
    }

    private IssuedSession issueSession(String principalId, String role, AuthUserResponse user) {
        String sessionId = tokens.newSessionId();
        String refreshToken = tokens.newRefreshToken();
        AuthSessionEntity session = new AuthSessionEntity(sessionId, principalId, role,
                tokens.hashToken(refreshToken), OffsetDateTime.now().plusSeconds(tokens.getRefreshTtlSeconds()));
        sessions.save(session);
        return new IssuedSession(principalId, role, sessionId, refreshToken, user);
    }

    private void enforceRateLimit(String key, int maxAttempts) {
        if (!rateLimits.allow(key, maxAttempts)) {
            throw new RateLimitExceededException();
        }
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private static String normalizeIp(String value) {
        return value == null || value.isBlank() ? "unknown" : value.trim().substring(0, Math.min(64, value.trim().length()));
    }

    private static String passwordPolicyError(String password) {
        if (password == null || password.length() < 8 || password.length() > 72) {
            return "Password must be between 8 and 72 characters.";
        }
        boolean hasUppercase = false;
        boolean hasLowercase = false;
        boolean hasNumber = false;
        for (char character : password.toCharArray()) {
            hasUppercase |= character >= 'A' && character <= 'Z';
            hasLowercase |= character >= 'a' && character <= 'z';
            hasNumber |= character >= '0' && character <= '9';
        }
        return hasUppercase && hasLowercase && hasNumber
                ? null
                : "Password must include uppercase, lowercase, and a number.";
    }

    public record IssuedSession(String principalId, String role, String sessionId,
            String refreshToken, AuthUserResponse user) {
    }

    public record CreatedCandidate(AuthUserResponse user, String verificationToken) {
    }
}

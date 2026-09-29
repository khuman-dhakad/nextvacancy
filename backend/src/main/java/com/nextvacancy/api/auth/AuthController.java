package com.nextvacancy.api.auth;

import java.security.SecureRandom;
import java.util.Base64;

import com.nextvacancy.api.auth.AuthenticationService.CreatedCandidate;
import com.nextvacancy.api.auth.AuthenticationService.IssuedSession;
import com.nextvacancy.api.auth.JwtPrincipal;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationService authentication;
    private final AuthTokenService tokens;
    private final AuthCookieService cookies;
    private final TransactionalEmailService email;
    private final SecureRandom random = new SecureRandom();

    public AuthController(
            AuthenticationService authentication,
            AuthTokenService tokens,
            AuthCookieService cookies,
            TransactionalEmailService email) {
        this.authentication = authentication;
        this.tokens = tokens;
        this.cookies = cookies;
        this.email = email;
    }

    @GetMapping("/csrf")
    public ResponseEntity<CsrfResponse> csrf() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String csrfToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookies.csrf(csrfToken, tokens.getRefreshTtlSeconds()).toString())
                .body(new CsrfResponse(csrfToken));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthUserResponse> register(
            @Valid @RequestBody RegistrationRequest request, HttpServletRequest httpRequest) {
        CreatedCandidate created = authentication.register(request, clientIp(httpRequest));
        email.sendVerification(created.user().email(), created.verificationToken());
        return ResponseEntity.accepted().body(created.user());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        IssuedSession session = authentication.login(request.email(), request.password(), clientIp(httpRequest));
        return issue(session);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(
            @Valid @RequestBody AdminLoginRequest request, HttpServletRequest httpRequest) {
        IssuedSession session = authentication.loginAdmin(request.identifier(), request.password(), clientIp(httpRequest));
        return issue(session);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = AuthCookieService.REFRESH_COOKIE, required = false) String refreshToken) {
        return issue(authentication.refresh(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal JwtPrincipal principal,
            @CookieValue(name = AuthCookieService.REFRESH_COOKIE, required = false) String refreshToken) {
        if (principal != null) {
            authentication.logout(principal.sessionId(), refreshToken);
        }
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookies.clearRefresh().toString())
                .header(HttpHeaders.SET_COOKIE, cookies.clearCsrf().toString())
                .build();
    }

    @GetMapping("/me")
    public CurrentPrincipalResponse me(@AuthenticationPrincipal JwtPrincipal principal) {
        AuthUserResponse profile = "CANDIDATE".equals(principal.role())
                ? authentication.currentUser(principal.id(), principal.role())
                : null;
        return new CurrentPrincipalResponse(principal.id(), principal.role(), profile);
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<Void> requestPasswordReset(
            @Valid @RequestBody EmailRequest request, HttpServletRequest httpRequest) {
        String rawToken = authentication.createPasswordResetToken(request.email(), clientIp(httpRequest));
        if (rawToken != null) {
            email.sendPasswordReset(request.email().trim().toLowerCase(java.util.Locale.ROOT), rawToken);
        }
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/password-reset/complete")
    public ResponseEntity<Void> completePasswordReset(@Valid @RequestBody PasswordResetCompletionRequest request) {
        authentication.resetPassword(request.token(), request.password());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email-verification/confirm")
    public ResponseEntity<Void> confirmEmail(@Valid @RequestBody RawTokenRequest request) {
        authentication.verifyEmail(request.token());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email-verification/resend")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Void> resendEmailVerification(
            @AuthenticationPrincipal JwtPrincipal principal) {
        String token = authentication.createVerificationToken(principal.id());
        AuthUserResponse user = authentication.currentUser(principal.id(), principal.role());
        email.sendVerification(user.email(), token);
        return ResponseEntity.accepted().build();
    }

    private ResponseEntity<AuthResponse> issue(IssuedSession session) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String csrfToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        AuthResponse body = new AuthResponse(
                tokens.createAccessToken(session.principalId(), session.role(), session.sessionId()),
                "Bearer",
                tokens.getAccessTtlSeconds(),
                csrfToken,
                session.role(),
                session.user());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,
                        cookies.refresh(session.refreshToken(), tokens.getRefreshTtlSeconds()).toString())
                .header(HttpHeaders.SET_COOKIE, cookies.csrf(csrfToken, tokens.getRefreshTtlSeconds()).toString())
                .body(body);
    }

    private static String clientIp(HttpServletRequest request) {
        String proxiedAddress = request.getHeader("X-Real-IP");
        return proxiedAddress == null || proxiedAddress.isBlank() ? request.getRemoteAddr() : proxiedAddress;
    }
}

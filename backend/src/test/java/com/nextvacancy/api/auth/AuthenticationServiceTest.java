package com.nextvacancy.api.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {
    @Mock private UserRepository users;
    @Mock private AuthSessionRepository sessions;
    @Mock private LegacySessionRepository legacySessions;
    @Mock private PasswordService passwords;
    @Mock private AuthTokenService tokens;
    @Mock private AuthRateLimitService rateLimits;

    private AuthenticationService authentication;

    @BeforeEach
    void setUp() {
        authentication = new AuthenticationService(users, sessions, legacySessions, passwords, tokens, rateLimits,
                "configured-admin", "admin@example.invalid", "configured-password-hash");
        given(rateLimits.allow(anyString(), anyInt())).willReturn(true);
    }

    @Test
    void logsInCandidateAndCreatesARefreshSession() {
        UserEntity candidate = candidate();
        given(tokens.newSessionId()).willReturn("session-1");
        given(tokens.newRefreshToken()).willReturn("refresh-secret");
        given(tokens.hashToken("refresh-secret")).willReturn("refresh-hash");
        given(tokens.getRefreshTtlSeconds()).willReturn(86400L);
        given(users.findByEmailIgnoreCaseForUpdate("candidate@example.com")).willReturn(Optional.of(candidate));
        given(passwords.matches("Correct-Pass1", "stored-hash")).willReturn(true);
        given(passwords.needsUpgrade("stored-hash")).willReturn(false);
        given(users.save(candidate)).willReturn(candidate);
        given(sessions.save(any(AuthSessionEntity.class))).willAnswer(call -> call.getArgument(0));

        AuthenticationService.IssuedSession issued =
                authentication.login("Candidate@example.com", "Correct-Pass1", "192.0.2.10");

        assertThat(issued.role()).isEqualTo("CANDIDATE");
        assertThat(issued.principalId()).isEqualTo(candidate.getId());
        assertThat(issued.sessionId()).isEqualTo("session-1");
        assertThat(issued.refreshToken()).isEqualTo("refresh-secret");
        assertThat(candidate.getFailedLoginAttempts()).isZero();
        verify(rateLimits).clear("login-email:candidate@example.com");
    }

    @Test
    void incrementsFailedAttemptsAndLocksCandidateAfterTheThreshold() {
        UserEntity candidate = candidate();
        given(users.findByEmailIgnoreCaseForUpdate("candidate@example.com"))
                .willReturn(Optional.of(candidate));
        given(passwords.matches("Incorrect-Pass1", "stored-hash")).willReturn(false);
        for (int attempt = 0; attempt < 5; attempt++) {
            candidate.setFailedLoginAttempts(attempt);

            assertThatThrownBy(() -> authentication.login(
                    "candidate@example.com", "Incorrect-Pass1", "192.0.2.10"))
                    .isInstanceOf(BadCredentialsException.class);
        }
        assertThat(candidate.getFailedLoginAttempts()).isEqualTo(5);
        assertThat(candidate.getLockedUntil()).isAfter(OffsetDateTime.now());
        verify(users, org.mockito.Mockito.times(5)).save(candidate);
    }

    @Test
    void performsPasswordWorkForUnknownAccountsAndRejectsLogin() {
        given(users.findByEmailIgnoreCaseForUpdate("unknown@example.com")).willReturn(Optional.empty());
        given(passwords.matches(anyString(), anyString())).willReturn(false);

        assertThatThrownBy(() -> authentication.login(
                "unknown@example.com", "Incorrect-Pass1", "192.0.2.10"))
                .isInstanceOf(BadCredentialsException.class);

        verify(users, never()).save(any(UserEntity.class));
    }

    private static UserEntity candidate() {
        return new UserEntity("candidate-1", "Candidate Example", "candidate@example.com",
                "9876543210", "stored-hash");
    }
}

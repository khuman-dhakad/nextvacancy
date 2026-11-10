package com.nextvacancy.api.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

@SpringJUnitConfig(AuthenticationServiceSpringContextTest.TestConfiguration.class)
@TestPropertySource(properties = {
        "app.admin.username=test-admin",
        "app.admin.email=test-admin@example.invalid",
        "app.admin.password-hash=test-password-hash",
        "app.auth.require-email-verification=true"
})
class AuthenticationServiceSpringContextTest {
    @Autowired
    private AuthenticationService authenticationService;

    @Test
    void createsAuthenticationServiceUsingItsInjectedConstructor() {
        assertThat(authenticationService).isNotNull();
    }

    @Configuration(proxyBeanMethods = false)
    @Import(AuthenticationService.class)
    static class TestConfiguration {
        @Bean
        UserRepository userRepository() {
            return mock(UserRepository.class);
        }

        @Bean
        AuthSessionRepository authSessionRepository() {
            return mock(AuthSessionRepository.class);
        }

        @Bean
        LegacySessionRepository legacySessionRepository() {
            return mock(LegacySessionRepository.class);
        }

        @Bean
        PasswordService passwordService() {
            return mock(PasswordService.class);
        }

        @Bean
        AuthTokenService authTokenService() {
            return mock(AuthTokenService.class);
        }

        @Bean
        AuthRateLimitService authRateLimitService() {
            return mock(AuthRateLimitService.class);
        }
    }
}

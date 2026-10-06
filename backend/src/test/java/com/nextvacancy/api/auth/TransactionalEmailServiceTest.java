package com.nextvacancy.api.auth;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class TransactionalEmailServiceTest {
    private static final String API_KEY = "test-api-key";
    private static final String SENDER = "NextVacancy <test@example.org>";

    @Test
    void acceptsLocalHttpOriginOnlyForDevelopment() {
        assertThatCode(() -> new TransactionalEmailService(
                API_KEY, SENDER, "http://localhost:5173", "development"))
                .doesNotThrowAnyException();
        assertThatThrownBy(() -> new TransactionalEmailService(
                API_KEY, SENDER, "http://localhost:5173", "production"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("APP_PUBLIC_URL");
    }

    @Test
    void productionRequiresAnExplicitPublicHttpsOrigin() {
        assertThatCode(() -> new TransactionalEmailService(
                API_KEY, SENDER, "https://nextvacancy.vercel.app", "production"))
                .doesNotThrowAnyException();
        assertThatThrownBy(() -> new TransactionalEmailService(
                API_KEY, SENDER, "https://nextvacancy.example.invalid", "production"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("APP_PUBLIC_URL");
    }
}

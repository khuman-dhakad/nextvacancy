package com.nextvacancy.api.auth;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class AuthCookieServiceTest {
    @Test
    void productionRefreshCookieIsSecureHttpOnlyCrossSiteAndScopedToAuth() {
        AuthCookieService cookies = new AuthCookieService("production");

        assertThat(cookies.refresh("refresh-token", 3600).toString())
                .contains("Path=/api/v1/auth", "Secure", "HttpOnly", "SameSite=None");
        assertThat(cookies.csrf("csrf-token", 3600).toString())
                .contains("Path=/api/v1/auth", "Secure", "SameSite=None")
                .doesNotContain("HttpOnly");
    }

    @Test
    void developmentCookiesRemainUsableOnLocalHttp() {
        AuthCookieService cookies = new AuthCookieService("development");

        assertThat(cookies.refresh("refresh-token", 3600).toString())
                .contains("Path=/api/v1/auth", "HttpOnly", "SameSite=Lax")
                .doesNotContain("Secure");
    }
}

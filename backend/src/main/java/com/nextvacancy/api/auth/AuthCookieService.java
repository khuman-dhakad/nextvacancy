package com.nextvacancy.api.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class AuthCookieService {
    public static final String REFRESH_COOKIE = "nextvacancy_refresh";
    public static final String CSRF_COOKIE = "nextvacancy_csrf";
    private static final String AUTH_PATH = "/api/v1/auth";

    private final boolean productionEnvironment;

    public AuthCookieService(@Value("${app.environment:development}") String environment) {
        this.productionEnvironment = "production".equalsIgnoreCase(environment);
    }

    public ResponseCookie refresh(String value, long maxAgeSeconds) {
        return baseCookie(REFRESH_COOKIE, value, true, maxAgeSeconds);
    }

    public ResponseCookie csrf(String value, long maxAgeSeconds) {
        return baseCookie(CSRF_COOKIE, value, false, maxAgeSeconds);
    }

    public ResponseCookie clearRefresh() {
        return refresh("", 0);
    }

    public ResponseCookie clearCsrf() {
        return csrf("", 0);
    }

    private ResponseCookie baseCookie(String name, String value, boolean httpOnly, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(httpOnly)
                .secure(productionEnvironment)
                .sameSite(productionEnvironment ? "None" : "Lax")
                .path(AUTH_PATH)
                .maxAge(maxAgeSeconds)
                .build();
    }
}

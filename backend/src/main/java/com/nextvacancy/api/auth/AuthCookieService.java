package com.nextvacancy.api.auth;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class AuthCookieService {
    public static final String REFRESH_COOKIE = "nextvacancy_refresh";
    public static final String CSRF_COOKIE = "nextvacancy_csrf";
    private static final String AUTH_PATH = "/api/v1/auth";

    public ResponseCookie refresh(String value, long maxAgeSeconds) {
        return ResponseCookie.from(REFRESH_COOKIE, value)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path(AUTH_PATH)
                .maxAge(maxAgeSeconds)
                .build();
    }

    public ResponseCookie csrf(String value, long maxAgeSeconds) {
        return ResponseCookie.from(CSRF_COOKIE, value)
                .httpOnly(false)
                .secure(true)
                .sameSite("None")
                .path(AUTH_PATH)
                .maxAge(maxAgeSeconds)
                .build();
    }

    public ResponseCookie clearRefresh() {
        return refresh("", 0);
    }

    public ResponseCookie clearCsrf() {
        return csrf("", 0);
    }
}

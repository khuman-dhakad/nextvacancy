package com.nextvacancy.api.auth;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        String csrfToken,
        String role,
        AuthUserResponse user) {
}

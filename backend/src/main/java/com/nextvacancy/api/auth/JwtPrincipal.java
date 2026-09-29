package com.nextvacancy.api.auth;

public record JwtPrincipal(String id, String sessionId, String role) {
}

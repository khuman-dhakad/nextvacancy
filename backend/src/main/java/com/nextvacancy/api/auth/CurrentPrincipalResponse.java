package com.nextvacancy.api.auth;

public record CurrentPrincipalResponse(String id, String role, AuthUserResponse profile) {
}

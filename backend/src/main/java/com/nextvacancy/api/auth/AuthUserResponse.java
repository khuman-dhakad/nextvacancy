package com.nextvacancy.api.auth;

import java.time.OffsetDateTime;

public record AuthUserResponse(
        String id,
        String fullName,
        String email,
        String mobile,
        String role,
        boolean isEmailVerified,
        OffsetDateTime createdAt) {
    public static AuthUserResponse from(UserEntity user) {
        return new AuthUserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getMobile(),
                user.getRole(), user.isEmailVerified(), user.getCreatedAt());
    }
}

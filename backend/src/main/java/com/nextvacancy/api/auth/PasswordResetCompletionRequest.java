package com.nextvacancy.api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordResetCompletionRequest(
        @NotBlank @Size(max = 256) String token,
        @NotBlank @Size(min = 8, max = 72)
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$",
                message = "Password must include uppercase, lowercase, and a number.")
        String password) {
}

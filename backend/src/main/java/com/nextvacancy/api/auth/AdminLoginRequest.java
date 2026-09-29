package com.nextvacancy.api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminLoginRequest(
        @NotBlank @Size(max = 255) String identifier,
        @NotBlank @Size(max = 72) String password) {
}

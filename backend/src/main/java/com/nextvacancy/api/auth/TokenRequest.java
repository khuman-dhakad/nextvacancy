package com.nextvacancy.api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TokenRequest(
        @NotBlank @Size(max = 256) String token,
        @NotBlank @Size(min = 8, max = 72) String password) {
}

package com.nextvacancy.api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RawTokenRequest(@NotBlank @Size(max = 256) String token) {
}

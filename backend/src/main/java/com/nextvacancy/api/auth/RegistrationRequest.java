package com.nextvacancy.api.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(
        @NotBlank @Size(min = 2, max = 255) @Pattern(regexp = "^[a-zA-Z\\s.'-]+$")
        String fullName,
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Pattern(regexp = "^[6-9][0-9]{9}$") String mobile,
        @NotBlank @Size(min = 8, max = 72) String password) {
}

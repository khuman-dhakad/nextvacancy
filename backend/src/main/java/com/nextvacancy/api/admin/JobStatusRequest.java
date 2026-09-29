package com.nextvacancy.api.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobStatusRequest(@NotBlank @Size(max = 64) String status) {
}

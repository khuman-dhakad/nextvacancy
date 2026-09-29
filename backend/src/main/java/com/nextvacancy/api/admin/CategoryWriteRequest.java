package com.nextvacancy.api.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryWriteRequest(
        @NotBlank @Size(max = 255) String name,
        @Size(max = 255) String slug,
        String description,
        @Size(max = 128) String icon,
        Boolean isActive,
        Boolean isFeatured) {
}

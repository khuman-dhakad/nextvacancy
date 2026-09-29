package com.nextvacancy.api.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OrganizationWriteRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Size(max = 64) String shortName,
        @Size(max = 255) String slug,
        String logoUrl,
        String website,
        String description,
        @Size(max = 128) String state,
        @Size(max = 128) String categoryType,
        Boolean isActive) {
}

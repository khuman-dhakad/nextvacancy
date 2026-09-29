package com.nextvacancy.api.admin;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record BulkIdsRequest(
        @NotEmpty @Size(max = 500) List<@NotBlank @Size(max = 128) String> ids) {
}

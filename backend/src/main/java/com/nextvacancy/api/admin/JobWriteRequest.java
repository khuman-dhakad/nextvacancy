package com.nextvacancy.api.admin;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobWriteRequest(
        @NotBlank @Size(max = 255) String title,
        @Size(max = 255) String slug,
        @NotBlank String shortSummary,
        @NotBlank @Size(max = 255) String organization,
        String organizationLogo,
        @Size(max = 255) String department,
        @NotBlank @Size(max = 64) String category,
        @NotBlank @Size(max = 64) String status,
        @NotBlank @Size(max = 255) String location,
        @NotBlank String totalVacancies,
        @NotBlank String salaryOrStipend,
        @Size(max = 64) String jobType,
        @Size(max = 64) String applicationMode,
        @NotBlank String qualificationSummary,
        JsonNode qualificationsList,
        JsonNode importantDates,
        JsonNode feeStructure,
        JsonNode ageLimit,
        JsonNode vacancyBreakdown,
        JsonNode selectionProcess,
        JsonNode howToApplySteps,
        JsonNode requiredDocuments,
        JsonNode importantLinks,
        JsonNode faqs,
        @JsonProperty("isFeatured") Boolean featured,
        @JsonProperty("isTrending") Boolean trending,
        @JsonProperty("isVerified") Boolean verified) {
}

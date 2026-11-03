package com.nextvacancy.api.admin;

import java.net.URI;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobWriteRequest(
        @NotBlank @Size(max = 255) String title,
        @Size(max = 255) String slug,
        @NotBlank String shortSummary,
        @NotBlank @Size(max = 255) String organization,
        @Size(max = 2048) String organizationLogo,
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

    public static final int MAX_URL_LENGTH = 2048;

    @AssertTrue(message = "importantLinks must be an array of valid http or https URLs with a max length of 2048 characters.")
    public boolean hasValidImportantLinks() {
        if (importantLinks == null) {
            return true;
        }
        if (!importantLinks.isArray()) {
            return false;
        }
        for (JsonNode item : importantLinks) {
            String url = extractUrl(item);
            if (url == null || !isValidHttpUrl(url)) {
                return false;
            }
        }
        return true;
    }

    @AssertTrue(message = "organizationLogo must use http or https and not exceed 2048 characters.")
    public boolean hasValidOrganizationLogo() {
        if (organizationLogo == null || organizationLogo.isBlank()) {
            return true;
        }
        return organizationLogo.length() <= MAX_URL_LENGTH && isValidHttpUrl(organizationLogo);
    }

    public static String extractUrl(JsonNode item) {
        if (item == null || item.isNull()) {
            return null;
        }
        if (item.isTextual()) {
            return item.asText().trim();
        }
        if (item.isObject()) {
            if (item.hasNonNull("url")) {
                return item.get("url").asText().trim();
            }
            if (item.hasNonNull("link")) {
                return item.get("link").asText().trim();
            }
            if (item.hasNonNull("href")) {
                return item.get("href").asText().trim();
            }
        }
        return null;
    }

    public static boolean isValidHttpUrl(String url) {
        if (url == null || url.isBlank() || url.length() > MAX_URL_LENGTH) {
            return false;
        }
        String trimmed = url.trim();
        try {
            URI uri = URI.create(trimmed);
            String scheme = uri.getScheme();
            if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                return false;
            }
            return uri.getHost() != null && !uri.getHost().isBlank();
        } catch (Exception e) {
            return false;
        }
    }
}

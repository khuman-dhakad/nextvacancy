package com.nextvacancy.api.organization;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.databind.JsonNode;

public record OrganizationResponse(
        String id,
        String slug,
        String name,
        String shortName,
        String categoryType,
        String headquarters,
        Integer establishedYear,
        String state,
        String website,
        boolean verified,
        String logoUrl,
        String tagline,
        String description,
        JsonNode aboutDetails,
        JsonNode selectionProcess,
        JsonNode keyDepartments,
        JsonNode faqs,
        OrganizationStats stats,
        OffsetDateTime updatedAt) {

    public static OrganizationResponse from(OrganizationEntity organization, OrganizationStats stats) {
        return new OrganizationResponse(
                organization.getId(),
                organization.getSlug(),
                organization.getName(),
                organization.getShortName(),
                organization.getCategoryType(),
                organization.getHeadquarters(),
                organization.getEstablishedYear(),
                organization.getState(),
                organization.getWebsite(),
                organization.isVerified(),
                organization.getLogoUrl(),
                organization.getTagline(),
                organization.getDescription(),
                organization.getAboutDetails(),
                organization.getSelectionProcess(),
                organization.getKeyDepartments(),
                organization.getFaqs(),
                stats,
                organization.getUpdatedAt());
    }
}

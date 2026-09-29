package com.nextvacancy.api.admin;

import com.nextvacancy.api.organization.OrganizationEntity;

public record AdminOrganizationResponse(
        String id,
        String name,
        String shortName,
        String slug,
        String logoUrl,
        String website,
        String description,
        String state,
        String categoryType,
        boolean isActive,
        int jobCount) {

    public static AdminOrganizationResponse from(OrganizationEntity organization) {
        return new AdminOrganizationResponse(
                organization.getId(), organization.getName(), organization.getShortName(),
                organization.getSlug(), organization.getLogoUrl(), organization.getWebsite(),
                organization.getDescription(), organization.getState(), organization.getCategoryType(),
                organization.isActive(), organization.getJobCount());
    }
}

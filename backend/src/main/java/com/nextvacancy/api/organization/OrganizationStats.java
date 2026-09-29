package com.nextvacancy.api.organization;

public record OrganizationStats(
        long activeVacanciesCount,
        long totalPostsCount,
        long admitCardsCount,
        long resultsCount) {
}

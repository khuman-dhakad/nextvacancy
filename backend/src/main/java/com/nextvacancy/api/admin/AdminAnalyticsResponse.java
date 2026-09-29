package com.nextvacancy.api.admin;

public record AdminAnalyticsResponse(
        long totalJobs,
        long openJobs,
        long totalOrganizations,
        long activeCategories,
        double averageViewsPerJob) {
}

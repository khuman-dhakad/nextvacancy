package com.nextvacancy.api.admin;

public record AdminDashboardResponse(
        long totalJobs,
        long openJobs,
        long totalOrganizations,
        long activeCategories,
        long totalViews,
        long featuredJobs) {
}

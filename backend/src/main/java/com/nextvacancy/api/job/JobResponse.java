package com.nextvacancy.api.job;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.databind.JsonNode;

public record JobResponse(
        String id,
        String slug,
        String title,
        String shortSummary,
        String organization,
        String organizationLogo,
        String department,
        String category,
        String status,
        String location,
        String totalVacancies,
        String salaryOrStipend,
        String jobType,
        String applicationMode,
        String qualificationSummary,
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
        int viewsCount,
        boolean isFeatured,
        boolean isTrending,
        boolean isVerified,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {

    public static JobResponse from(JobEntity job) {
        return new JobResponse(
                job.getId(), job.getSlug(), job.getTitle(), job.getShortSummary(),
                job.getOrganization(), job.getOrganizationLogo(), job.getDepartment(),
                job.getCategory(), job.getStatus(), job.getLocation(), job.getTotalVacancies(),
                job.getSalaryOrStipend(), job.getJobType(), job.getApplicationMode(),
                job.getQualificationSummary(), job.getQualificationsList(), job.getImportantDates(),
                job.getFeeStructure(), job.getAgeLimit(), job.getVacancyBreakdown(),
                job.getSelectionProcess(), job.getHowToApplySteps(), job.getRequiredDocuments(),
                job.getImportantLinks(), job.getFaqs(), job.getViewsCount(), job.isFeatured(),
                job.isTrending(), job.isVerified(), job.getCreatedAt(), job.getUpdatedAt());
    }
}

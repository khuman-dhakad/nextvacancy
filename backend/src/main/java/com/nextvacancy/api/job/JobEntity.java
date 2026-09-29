package com.nextvacancy.api.job;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "jobs")
public class JobEntity {
    @Id
    @Column(length = 128)
    private String id;

    @Column(nullable = false, length = 255)
    private String slug;

    @Column(nullable = false, columnDefinition = "text")
    private String title;

    @Column(name = "short_summary", nullable = false, columnDefinition = "text")
    private String shortSummary;

    @Column(nullable = false, length = 255)
    private String organization;

    @Column(name = "organization_logo", columnDefinition = "text")
    private String organizationLogo;

    @Column(length = 255)
    private String department;

    @Column(nullable = false, length = 64)
    private String category;

    @Column(nullable = false, length = 64)
    private String status;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "total_vacancies", nullable = false, columnDefinition = "text")
    private String totalVacancies;

    @Column(name = "salary_or_stipend", nullable = false, columnDefinition = "text")
    private String salaryOrStipend;

    @Column(name = "job_type", length = 64)
    private String jobType;

    @Column(name = "application_mode", length = 64)
    private String applicationMode;

    @Column(name = "qualification_summary", nullable = false, columnDefinition = "text")
    private String qualificationSummary;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "qualifications_list", columnDefinition = "jsonb")
    private JsonNode qualificationsList;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "important_dates", nullable = false, columnDefinition = "jsonb")
    private JsonNode importantDates;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "fee_structure", columnDefinition = "jsonb")
    private JsonNode feeStructure;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "age_limit", columnDefinition = "jsonb")
    private JsonNode ageLimit;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "vacancy_breakdown", columnDefinition = "jsonb")
    private JsonNode vacancyBreakdown;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "selection_process", columnDefinition = "jsonb")
    private JsonNode selectionProcess;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "how_to_apply_steps", columnDefinition = "jsonb")
    private JsonNode howToApplySteps;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "required_documents", columnDefinition = "jsonb")
    private JsonNode requiredDocuments;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "important_links", nullable = false, columnDefinition = "jsonb")
    private JsonNode importantLinks;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "faqs", columnDefinition = "jsonb")
    private JsonNode faqs;

    @Column(name = "views_count", nullable = false)
    private int viewsCount;

    @Column(name = "is_featured", nullable = false)
    private boolean featured;

    @Column(name = "is_trending", nullable = false)
    private boolean trending;

    @Column(name = "is_verified", nullable = false)
    private boolean verified;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public JobEntity() {
    }

    public String getId() { return id; }
    public String getSlug() { return slug; }
    public String getTitle() { return title; }
    public String getShortSummary() { return shortSummary; }
    public String getOrganization() { return organization; }
    public String getOrganizationLogo() { return organizationLogo; }
    public String getDepartment() { return department; }
    public String getCategory() { return category; }
    public String getStatus() { return status; }
    public String getLocation() { return location; }
    public String getTotalVacancies() { return totalVacancies; }
    public String getSalaryOrStipend() { return salaryOrStipend; }
    public String getJobType() { return jobType; }
    public String getApplicationMode() { return applicationMode; }
    public String getQualificationSummary() { return qualificationSummary; }
    public JsonNode getQualificationsList() { return qualificationsList; }
    public JsonNode getImportantDates() { return importantDates; }
    public JsonNode getFeeStructure() { return feeStructure; }
    public JsonNode getAgeLimit() { return ageLimit; }
    public JsonNode getVacancyBreakdown() { return vacancyBreakdown; }
    public JsonNode getSelectionProcess() { return selectionProcess; }
    public JsonNode getHowToApplySteps() { return howToApplySteps; }
    public JsonNode getRequiredDocuments() { return requiredDocuments; }
    public JsonNode getImportantLinks() { return importantLinks; }
    public JsonNode getFaqs() { return faqs; }
    public int getViewsCount() { return viewsCount; }
    public boolean isFeatured() { return featured; }
    public boolean isTrending() { return trending; }
    public boolean isVerified() { return verified; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void setSlug(String slug) { this.slug = slug; }
    public void setTitle(String title) { this.title = title; }
    public void setShortSummary(String shortSummary) { this.shortSummary = shortSummary; }
    public void setOrganization(String organization) { this.organization = organization; }
    public void setOrganizationLogo(String organizationLogo) { this.organizationLogo = organizationLogo; }
    public void setDepartment(String department) { this.department = department; }
    public void setCategory(String category) { this.category = category; }
    public void setStatus(String status) { this.status = status; }
    public void setLocation(String location) { this.location = location; }
    public void setTotalVacancies(String totalVacancies) { this.totalVacancies = totalVacancies; }
    public void setSalaryOrStipend(String salaryOrStipend) { this.salaryOrStipend = salaryOrStipend; }
    public void setJobType(String jobType) { this.jobType = jobType; }
    public void setApplicationMode(String applicationMode) { this.applicationMode = applicationMode; }
    public void setQualificationSummary(String qualificationSummary) { this.qualificationSummary = qualificationSummary; }
    public void setQualificationsList(JsonNode qualificationsList) { this.qualificationsList = qualificationsList; }
    public void setImportantDates(JsonNode importantDates) { this.importantDates = importantDates; }
    public void setFeeStructure(JsonNode feeStructure) { this.feeStructure = feeStructure; }
    public void setAgeLimit(JsonNode ageLimit) { this.ageLimit = ageLimit; }
    public void setVacancyBreakdown(JsonNode vacancyBreakdown) { this.vacancyBreakdown = vacancyBreakdown; }
    public void setSelectionProcess(JsonNode selectionProcess) { this.selectionProcess = selectionProcess; }
    public void setHowToApplySteps(JsonNode howToApplySteps) { this.howToApplySteps = howToApplySteps; }
    public void setRequiredDocuments(JsonNode requiredDocuments) { this.requiredDocuments = requiredDocuments; }
    public void setImportantLinks(JsonNode importantLinks) { this.importantLinks = importantLinks; }
    public void setFaqs(JsonNode faqs) { this.faqs = faqs; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public void setTrending(boolean trending) { this.trending = trending; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public void setId(String id) { this.id = id; }
    public void setViewsCount(int viewsCount) { this.viewsCount = viewsCount; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}

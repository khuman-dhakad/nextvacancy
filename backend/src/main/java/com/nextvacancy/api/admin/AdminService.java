package com.nextvacancy.api.admin;

import java.text.Normalizer;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

import com.nextvacancy.api.category.CategoryEntity;
import com.nextvacancy.api.category.CategoryRepository;
import com.nextvacancy.api.category.CategoryResponse;
import com.nextvacancy.api.job.JobEntity;
import com.nextvacancy.api.job.JobRepository;
import com.nextvacancy.api.job.JobResponse;
import com.nextvacancy.api.organization.OrganizationEntity;
import com.nextvacancy.api.organization.OrganizationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class AdminService {
    private static final Pattern VALID_SLUG = Pattern.compile("[a-z0-9]+(?:-[a-z0-9]+)*");
    private static final List<String> JOB_CATEGORIES = List.of(
            "government", "private", "admit-card", "result", "answer-key",
            "scholarship", "scheme", "internship", "apprenticeship", "work-from-home");
    private static final List<String> JOB_STATUSES = List.of(
            "OPEN", "ENDING_SOON", "CLOSED", "ADMIT_CARD_OUT", "RESULT_OUT", "ANSWER_KEY_OUT");

    private final JobRepository jobs;
    private final CategoryRepository categories;
    private final OrganizationRepository organizations;
    private final AuditLogRepository auditLogs;

    public AdminService(
            JobRepository jobs,
            CategoryRepository categories,
            OrganizationRepository organizations,
            AuditLogRepository auditLogs) {
        this.jobs = jobs;
        this.categories = categories;
        this.organizations = organizations;
        this.auditLogs = auditLogs;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse dashboard() {
        long totalJobs = jobs.count();
        long openJobs = jobs.countOpenJobs();
        long featuredJobs = jobs.countFeaturedJobs();
        long totalViews = jobs.sumViewsCount();
        long totalOrganizations = organizations.count();
        long activeCategories = categories.countByActiveTrue();
        return new AdminDashboardResponse(totalJobs, openJobs, totalOrganizations, activeCategories, totalViews, featuredJobs);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> jobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return jobs.findAll(pageable).map(JobResponse::from);
    }

    @Transactional(readOnly = true)
    public JobResponse job(String id) {
        return jobs.findById(id).map(JobResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("Job not found."));
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> categories() {
        return categories.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminOrganizationResponse> organizations() {
        return organizations.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(AdminOrganizationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsResponse analytics() {
        long totalJobs = jobs.count();
        long openJobs = jobs.countOpenJobs();
        long totalOrganizations = organizations.count();
        long activeCategories = categories.countByActiveTrue();
        Double averageViews = jobs.averageViewsCount();
        double averageViewsPerJob = averageViews == null ? 0 : averageViews;
        return new AdminAnalyticsResponse(totalJobs, openJobs, totalOrganizations, activeCategories, averageViewsPerJob);
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> activity(int limit) {
        if (limit < 1 || limit > 100) throw new IllegalArgumentException("limit must be between 1 and 100.");
        return auditLogs.findAllByOrderByTimestampDesc(PageRequest.of(0, limit)).stream()
                .map(AuditLogResponse::from)
                .toList();
    }

    @Transactional
    public JobResponse createJob(JobWriteRequest request, String actor) {
        validateJob(request);
        OffsetDateTime now = OffsetDateTime.now();
        JobEntity job = new JobEntity();
        job.setId(newId("job-"));
        job.setTitle(request.title().trim());
        job.setSlug(uniqueSlug(request.slug(), request.title(), jobs::existsBySlugIgnoreCase));
        applyJob(job, request);
        job.setViewsCount(0);
        job.setCreatedAt(now);
        job.setUpdatedAt(now);
        JobEntity saved = jobs.saveAndFlush(job);
        audit(actor, "CREATE", "JOB", saved.getId(), saved.getTitle(), "Created new " + saved.getCategory() + " vacancy.");
        return JobResponse.from(saved);
    }

    @Transactional
    public JobResponse updateJob(String id, JobWriteRequest request, String actor) {
        validateJob(request);
        JobEntity job = jobs.findById(id).orElseThrow(() -> new EntityNotFoundException("Job not found."));
        job.setTitle(request.title().trim());
        job.setSlug(uniqueSlug(request.slug(), request.title(), slug -> jobs.existsBySlugIgnoreCaseAndIdNot(slug, id)));
        applyJob(job, request);
        job.setUpdatedAt(OffsetDateTime.now());
        JobEntity saved = jobs.saveAndFlush(job);
        audit(actor, "UPDATE", "JOB", saved.getId(), saved.getTitle(), "Updated circular details for " + saved.getOrganization() + ".");
        return JobResponse.from(saved);
    }

    @Transactional
    public void deleteJob(String id, String actor) {
        JobEntity job = jobs.findById(id).orElseThrow(() -> new EntityNotFoundException("Job not found."));
        String title = job.getTitle();
        jobs.delete(job);
        jobs.flush();
        audit(actor, "DELETE", "JOB", id, title, "Deleted job posting record " + id + ".");
    }

    @Transactional
    public int bulkUpdateJobStatus(BulkJobStatusRequest request, String actor) {
        String status = request.status();
        if (!JOB_STATUSES.contains(status)) throw new IllegalArgumentException("status is invalid.");
        List<JobEntity> selected = jobs.findAllById(request.ids());
        selected.forEach(job -> {
            job.setStatus(status);
            job.setUpdatedAt(OffsetDateTime.now());
        });
        jobs.saveAllAndFlush(selected);
        if (!selected.isEmpty()) {
            audit(actor, "PUBLISH", "JOB", null, selected.size() + " Job Postings",
                    "Bulk status update to " + status + ".");
        }
        return selected.size();
    }

    @Transactional
    public int bulkDeleteJobs(BulkIdsRequest request, String actor) {
        List<JobEntity> selected = jobs.findAllById(request.ids());
        if (!selected.isEmpty()) {
            jobs.deleteAll(selected);
            jobs.flush();
            audit(actor, "DELETE", "JOB", null, selected.size() + " Job Postings",
                    "Bulk deletion of " + selected.size() + " records.");
        }
        return selected.size();
    }

    @Transactional
    public JobResponse duplicateJob(String id, String actor) {
        JobEntity source = jobs.findById(id).orElseThrow(() -> new EntityNotFoundException("Job not found."));
        OffsetDateTime now = OffsetDateTime.now();
        JobEntity copy = copyJob(source);
        copy.setId(newId("job-"));
        copy.setTitle(source.getTitle() + " (Copy)");
        copy.setSlug(uniqueSlug(source.getSlug() + "-copy", source.getTitle() + "-copy", jobs::existsBySlugIgnoreCase));
        copy.setStatus("CLOSED");
        copy.setViewsCount(0);
        copy.setFeatured(false);
        copy.setTrending(false);
        copy.setCreatedAt(now);
        copy.setUpdatedAt(now);
        JobEntity saved = jobs.saveAndFlush(copy);
        audit(actor, "DUPLICATE", "JOB", saved.getId(), saved.getTitle(), "Cloned from " + source.getTitle() + " as draft.");
        return JobResponse.from(saved);
    }

    @Transactional
    public JobResponse updateJobStatus(String id, String status, String actor) {
        if (!JOB_STATUSES.contains(status)) {
            throw new IllegalArgumentException("status is invalid.");
        }
        JobEntity job = jobs.findById(id).orElseThrow(() -> new EntityNotFoundException("Job not found."));
        job.setStatus(status);
        job.setUpdatedAt(OffsetDateTime.now());
        JobEntity saved = jobs.saveAndFlush(job);
        String action = "OPEN".equals(status) ? "PUBLISH" : "UNPUBLISH";
        audit(actor, action, "JOB", saved.getId(), saved.getTitle(), "Changed publication status to " + status + ".");
        return JobResponse.from(saved);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryWriteRequest request, String actor) {
        validateCategory(request);
        OffsetDateTime now = OffsetDateTime.now();
        CategoryEntity category = new CategoryEntity();
        category.setId(newId("cat-"));
        category.setName(request.name().trim());
        category.setSlug(uniqueSlug(request.slug(), request.name(), categories::existsBySlugIgnoreCase));
        category.setDescription(request.description());
        category.setIcon(request.icon());
        category.setActive(request.isActive() == null || request.isActive());
        category.setFeatured(Boolean.TRUE.equals(request.isFeatured()));
        category.setJobCount(0);
        category.setCreatedAt(now);
        category.setUpdatedAt(now);
        CategoryEntity saved = categories.saveAndFlush(category);
        audit(actor, "CREATE", "CATEGORY", saved.getId(), saved.getName(), "Created category " + saved.getSlug() + ".");
        return CategoryResponse.from(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(String id, CategoryWriteRequest request, String actor) {
        validateCategory(request);
        CategoryEntity category = categories.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found."));
        category.setName(request.name().trim());
        category.setSlug(uniqueSlug(request.slug(), request.name(), slug -> categories.existsBySlugIgnoreCaseAndIdNot(slug, id)));
        category.setDescription(request.description());
        category.setIcon(request.icon());
        if (request.isActive() != null) category.setActive(request.isActive());
        if (request.isFeatured() != null) category.setFeatured(request.isFeatured());
        category.setUpdatedAt(OffsetDateTime.now());
        CategoryEntity saved = categories.saveAndFlush(category);
        audit(actor, "UPDATE", "CATEGORY", saved.getId(), saved.getName(), "Updated category.");
        return CategoryResponse.from(saved);
    }

    @Transactional
    public CategoryResponse updateCategoryStatus(String id, MasterDataStatusRequest request, String actor) {
        CategoryEntity category = categories.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found."));
        if (request.isActive() == null && request.isFeatured() == null) {
            throw new IllegalArgumentException("At least one category status field is required.");
        }
        if (request.isActive() != null) category.setActive(request.isActive());
        if (request.isFeatured() != null) category.setFeatured(request.isFeatured());
        category.setUpdatedAt(OffsetDateTime.now());
        CategoryEntity saved = categories.saveAndFlush(category);
        audit(actor, "UPDATE", "CATEGORY", saved.getId(), saved.getName(), "Updated category status.");
        return CategoryResponse.from(saved);
    }

    @Transactional
    public void deleteCategory(String id, String actor) {
        CategoryEntity category = categories.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found."));
        String name = category.getName();
        categories.delete(category);
        categories.flush();
        audit(actor, "DELETE", "CATEGORY", id, name, "Deleted category record.");
    }

    @Transactional
    public int bulkUpdateCategoryStatus(BulkMasterDataStatusRequest request, String actor) {
        List<CategoryEntity> selected = categories.findAllById(request.ids());
        selected.forEach(category -> {
            category.setActive(request.isActive());
            category.setUpdatedAt(OffsetDateTime.now());
        });
        categories.saveAllAndFlush(selected);
        if (!selected.isEmpty()) {
            audit(actor, "UPDATE", "CATEGORY", null, selected.size() + " Categories",
                    "Bulk active status update to " + request.isActive() + ".");
        }
        return selected.size();
    }

    @Transactional
    public int bulkDeleteCategories(BulkIdsRequest request, String actor) {
        List<CategoryEntity> selected = categories.findAllById(request.ids());
        if (!selected.isEmpty()) {
            categories.deleteAll(selected);
            categories.flush();
            audit(actor, "DELETE", "CATEGORY", null, selected.size() + " Categories",
                    "Bulk deletion of " + selected.size() + " records.");
        }
        return selected.size();
    }

    @Transactional
    public AdminOrganizationResponse createOrganization(OrganizationWriteRequest request, String actor) {
        validateOrganization(request);
        OffsetDateTime now = OffsetDateTime.now();
        OrganizationEntity organization = new OrganizationEntity();
        organization.setId(newId("org-"));
        organization.setName(request.name().trim());
        organization.setShortName(request.shortName().trim());
        organization.setSlug(uniqueSlug(request.slug(), request.name(), organizations::existsBySlugIgnoreCase));
        organization.setLogoUrl(request.logoUrl());
        organization.setWebsite(request.website());
        organization.setDescription(request.description());
        organization.setState(request.state());
        organization.setCategoryType(request.categoryType());
        organization.setActive(request.isActive() == null || request.isActive());
        organization.setVerified(true);
        organization.setJobCount(0);
        organization.setCreatedAt(now);
        organization.setUpdatedAt(now);
        OrganizationEntity saved = organizations.saveAndFlush(organization);
        audit(actor, "CREATE", "ORGANIZATION", saved.getId(), saved.getName(), "Created organization.");
        return AdminOrganizationResponse.from(saved);
    }

    @Transactional
    public AdminOrganizationResponse updateOrganization(String id, OrganizationWriteRequest request, String actor) {
        validateOrganization(request);
        OrganizationEntity organization = organizations.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found."));
        organization.setName(request.name().trim());
        organization.setShortName(request.shortName().trim());
        organization.setSlug(uniqueSlug(request.slug(), request.name(), slug -> organizations.existsBySlugIgnoreCaseAndIdNot(slug, id)));
        organization.setLogoUrl(request.logoUrl());
        organization.setWebsite(request.website());
        organization.setDescription(request.description());
        organization.setState(request.state());
        organization.setCategoryType(request.categoryType());
        if (request.isActive() != null) organization.setActive(request.isActive());
        organization.setUpdatedAt(OffsetDateTime.now());
        OrganizationEntity saved = organizations.saveAndFlush(organization);
        audit(actor, "UPDATE", "ORGANIZATION", saved.getId(), saved.getName(), "Updated organization.");
        return AdminOrganizationResponse.from(saved);
    }

    @Transactional
    public AdminOrganizationResponse updateOrganizationStatus(String id, MasterDataStatusRequest request, String actor) {
        if (request.isActive() == null || request.isFeatured() != null) {
            throw new IllegalArgumentException("Only isActive is supported for organizations.");
        }
        OrganizationEntity organization = organizations.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found."));
        organization.setActive(request.isActive());
        organization.setUpdatedAt(OffsetDateTime.now());
        OrganizationEntity saved = organizations.saveAndFlush(organization);
        audit(actor, "UPDATE", "ORGANIZATION", saved.getId(), saved.getName(), "Updated organization status.");
        return AdminOrganizationResponse.from(saved);
    }

    @Transactional
    public void deleteOrganization(String id, String actor) {
        OrganizationEntity organization = organizations.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found."));
        String name = organization.getName();
        organizations.delete(organization);
        organizations.flush();
        audit(actor, "DELETE", "ORGANIZATION", id, name, "Deleted organization record.");
    }

    @Transactional
    public int bulkUpdateOrganizationStatus(BulkMasterDataStatusRequest request, String actor) {
        List<OrganizationEntity> selected = organizations.findAllById(request.ids());
        selected.forEach(organization -> {
            organization.setActive(request.isActive());
            organization.setUpdatedAt(OffsetDateTime.now());
        });
        organizations.saveAllAndFlush(selected);
        if (!selected.isEmpty()) {
            audit(actor, "UPDATE", "ORGANIZATION", null, selected.size() + " Organizations",
                    "Bulk active status update to " + request.isActive() + ".");
        }
        return selected.size();
    }

    @Transactional
    public int bulkDeleteOrganizations(BulkIdsRequest request, String actor) {
        List<OrganizationEntity> selected = organizations.findAllById(request.ids());
        if (!selected.isEmpty()) {
            organizations.deleteAll(selected);
            organizations.flush();
            audit(actor, "DELETE", "ORGANIZATION", null, selected.size() + " Organizations",
                    "Bulk deletion of " + selected.size() + " records.");
        }
        return selected.size();
    }

    private void applyJob(JobEntity job, JobWriteRequest request) {
        validateJob(request);
        job.setShortSummary(request.shortSummary().trim());
        job.setOrganization(request.organization().trim());
        job.setOrganizationLogo(request.organizationLogo());
        job.setDepartment(request.department());
        job.setCategory(request.category());
        job.setStatus(request.status());
        job.setLocation(request.location().trim());
        job.setTotalVacancies(request.totalVacancies().trim());
        job.setSalaryOrStipend(request.salaryOrStipend().trim());
        job.setJobType(request.jobType());
        job.setApplicationMode(request.applicationMode());
        job.setQualificationSummary(request.qualificationSummary().trim());
        job.setQualificationsList(request.qualificationsList());
        job.setImportantDates(request.importantDates());
        job.setFeeStructure(request.feeStructure());
        job.setAgeLimit(request.ageLimit());
        job.setVacancyBreakdown(request.vacancyBreakdown());
        job.setSelectionProcess(request.selectionProcess());
        job.setHowToApplySteps(request.howToApplySteps());
        job.setRequiredDocuments(request.requiredDocuments());
        job.setImportantLinks(request.importantLinks());
        job.setFaqs(request.faqs());
        job.setFeatured(Boolean.TRUE.equals(request.featured()));
        job.setTrending(Boolean.TRUE.equals(request.trending()));
        job.setVerified(request.verified() == null || request.verified());
    }

    private static JobEntity copyJob(JobEntity source) {
        JobEntity copy = new JobEntity();
        copy.setTitle(source.getTitle());
        copy.setShortSummary(source.getShortSummary());
        copy.setOrganization(source.getOrganization());
        copy.setOrganizationLogo(source.getOrganizationLogo());
        copy.setDepartment(source.getDepartment());
        copy.setCategory(source.getCategory());
        copy.setStatus(source.getStatus());
        copy.setLocation(source.getLocation());
        copy.setTotalVacancies(source.getTotalVacancies());
        copy.setSalaryOrStipend(source.getSalaryOrStipend());
        copy.setJobType(source.getJobType());
        copy.setApplicationMode(source.getApplicationMode());
        copy.setQualificationSummary(source.getQualificationSummary());
        copy.setQualificationsList(source.getQualificationsList());
        copy.setImportantDates(source.getImportantDates());
        copy.setFeeStructure(source.getFeeStructure());
        copy.setAgeLimit(source.getAgeLimit());
        copy.setVacancyBreakdown(source.getVacancyBreakdown());
        copy.setSelectionProcess(source.getSelectionProcess());
        copy.setHowToApplySteps(source.getHowToApplySteps());
        copy.setRequiredDocuments(source.getRequiredDocuments());
        copy.setImportantLinks(source.getImportantLinks());
        copy.setFaqs(source.getFaqs());
        copy.setVerified(source.isVerified());
        return copy;
    }

    private static void validateJob(JobWriteRequest request) {
        if (!JOB_CATEGORIES.contains(request.category())) throw new IllegalArgumentException("category is invalid.");
        if (!JOB_STATUSES.contains(request.status())) throw new IllegalArgumentException("status is invalid.");
        if (request.importantDates() == null || !request.importantDates().isObject()) {
            throw new IllegalArgumentException("importantDates must be an object.");
        }
        if (request.importantLinks() == null || !request.importantLinks().isArray()
                || request.importantLinks().isEmpty()) {
            throw new IllegalArgumentException("importantLinks must be a non-empty array.");
        }
        for (String field : List.of("qualificationsList", "selectionProcess", "howToApplySteps", "requiredDocuments")) {
            var value = switch (field) {
                case "qualificationsList" -> request.qualificationsList();
                case "selectionProcess" -> request.selectionProcess();
                case "howToApplySteps" -> request.howToApplySteps();
                default -> request.requiredDocuments();
            };
            if (value != null && !value.isArray()) throw new IllegalArgumentException(field + " must be an array.");
        }
        for (String field : List.of("vacancyBreakdown", "faqs")) {
            var value = "vacancyBreakdown".equals(field) ? request.vacancyBreakdown() : request.faqs();
            if (value != null && !value.isArray()) throw new IllegalArgumentException(field + " must be an array.");
        }
    }

    private static void validateCategory(CategoryWriteRequest request) {
        if (request.slug() != null && !request.slug().isBlank() && !VALID_SLUG.matcher(request.slug()).matches()) {
            throw new IllegalArgumentException("slug must be a lowercase URL-safe value.");
        }
    }

    private static void validateOrganization(OrganizationWriteRequest request) {
        if (request.slug() != null && !request.slug().isBlank() && !VALID_SLUG.matcher(request.slug()).matches()) {
            throw new IllegalArgumentException("slug must be a lowercase URL-safe value.");
        }
    }

    private static String uniqueSlug(String requested, String source, java.util.function.Predicate<String> exists) {
        String base = StringUtils.hasText(requested) ? requested.trim() : slugify(source);
        if (!VALID_SLUG.matcher(base).matches()) {
            throw new IllegalArgumentException("slug must be a lowercase URL-safe value.");
        }
        if (!exists.test(base)) return base;
        for (int suffix = 2; suffix < Integer.MAX_VALUE; suffix++) {
            String candidate = base + "-" + suffix;
            if (!exists.test(candidate)) return candidate;
        }
        throw new IllegalStateException("Unable to generate a unique slug.");
    }

    private static String slugify(String value) {
        String normalized = Normalizer.normalize(value.trim().toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        if (normalized.isBlank()) throw new IllegalArgumentException("A URL-safe slug could not be generated.");
        return normalized;
    }

    private void audit(String actor, String action, String entity, String entityId, String title, String details) {
        auditLogs.save(new AuditLogEntity(
                newId("act-"), actor, action, entity, entityId, title, details, OffsetDateTime.now()));
    }

    private static String newId(String prefix) {
        return prefix + UUID.randomUUID();
    }
}

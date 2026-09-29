package com.nextvacancy.api.organization;

import java.util.List;
import java.util.Locale;

import com.nextvacancy.api.job.JobEntity;
import com.nextvacancy.api.job.JobRepository;
import com.nextvacancy.api.job.JobResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class OrganizationService {
    private static final int MAX_PAGE_SIZE = 100;

    private final OrganizationRepository organizations;
    private final JobRepository jobs;

    public OrganizationService(OrganizationRepository organizations, JobRepository jobs) {
        this.organizations = organizations;
        this.jobs = jobs;
    }

    @Transactional(readOnly = true)
    public List<OrganizationResponse> list() {
        return organizations.findAllByActiveTrueOrderByCreatedAtDesc().stream()
                .map(organization -> OrganizationResponse.from(organization, emptyStats()))
                .toList();
    }

    @Transactional(readOnly = true)
    public OrganizationResponse find(String slugOrShortName) {
        String clean = slugOrShortName.trim();
        OrganizationEntity organization = organizations
                .findFirstByActiveTrueAndSlugIgnoreCaseOrActiveTrueAndShortNameIgnoreCase(clean, clean)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found."));

        String shortPattern = pattern(organization.getShortName());
        String namePattern = pattern(organization.getName());
        long total = jobs.countPublicOrganizationJobs(shortPattern, namePattern);
        long active = jobs.countPublicOrganizationJobsByStatus(shortPattern, namePattern, "OPEN", "ENDING_SOON");
        long admitCards = jobs.countPublicOrganizationJobsByStatusOrCategory(
                shortPattern, namePattern, "ADMIT_CARD_OUT", "admit-card");
        long results = jobs.countPublicOrganizationJobsByStatusOrCategory(
                shortPattern, namePattern, "RESULT_OUT", "result");
        return OrganizationResponse.from(
                organization, new OrganizationStats(active, total, admitCards, results));
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> jobs(String slugOrShortName, int page, int size) {
        if (page < 0) throw new IllegalArgumentException("page must be zero or greater.");
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("size must be between 1 and " + MAX_PAGE_SIZE + ".");
        }
        OrganizationEntity organization = organizations
                .findFirstByActiveTrueAndSlugIgnoreCaseOrActiveTrueAndShortNameIgnoreCase(
                        slugOrShortName.trim(), slugOrShortName.trim())
                .orElseThrow(() -> new EntityNotFoundException("Organization not found."));
        return jobs.findPublicJobsByOrganizationPattern(
                        pattern(organization.getSlug()),
                        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(JobResponse::from);
    }

    @Transactional(readOnly = true)
    public List<OrganizationResponse> related(String slugOrShortName, int limit) {
        if (limit < 1 || limit > 20) throw new IllegalArgumentException("limit must be between 1 and 20.");
        OrganizationResponse current = find(slugOrShortName);
        List<OrganizationEntity> related = organizations.findRelatedByCategory(
                current.slug(), current.categoryType(), PageRequest.of(0, limit));
        if (related.size() < limit) {
            related = organizations.findOtherActive(current.slug(), PageRequest.of(0, limit));
        }
        return related.stream()
                .map(organization -> OrganizationResponse.from(organization, emptyStats()))
                .toList();
    }

    private static OrganizationStats emptyStats() {
        return new OrganizationStats(0, 0, 0, 0);
    }

    private static String pattern(String value) {
        String normalized = StringUtils.hasText(value) ? value.trim().toLowerCase(Locale.ROOT) : "";
        return "%" + normalized.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%";
    }
}

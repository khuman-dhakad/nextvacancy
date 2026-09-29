package com.nextvacancy.api.job;

import java.util.Locale;
import java.util.List;
import java.util.Set;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class JobCatalogService {
    private static final int MAX_PAGE_SIZE = 100;
    private static final int MAX_QUERY_LENGTH = 128;
    private static final Set<String> ALLOWED_SORTS =
            Set.of("latest", "createdAt", "title", "organization", "alphabetical", "views", "deadline");
    private static final Set<String> PUBLIC_STATUSES =
            Set.of("OPEN", "ENDING_SOON", "ADMIT_CARD_OUT", "RESULT_OUT", "ANSWER_KEY_OUT");

    private final JobRepository repository;

    public JobCatalogService(JobRepository repository) {
        this.repository = repository;
    }

    public Page<JobResponse> search(
            int page, int size, String query, String category, String status,
            String qualification, String location, String sort, String direction) {
        if (page < 0) {
            throw new IllegalArgumentException("page must be zero or greater.");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("size must be between 1 and " + MAX_PAGE_SIZE + ".");
        }
        if (query != null && query.length() > MAX_QUERY_LENGTH) {
            throw new IllegalArgumentException("q must be at most " + MAX_QUERY_LENGTH + " characters.");
        }
        if (StringUtils.hasText(status)
                && !PUBLIC_STATUSES.contains(status.trim().toUpperCase(Locale.ROOT))) {
            throw new IllegalArgumentException("status is not available in the public job catalog.");
        }

        String sortProperty = StringUtils.hasText(sort) ? sort : "latest";
        if (!ALLOWED_SORTS.contains(sortProperty)) {
            throw new IllegalArgumentException("sort must be one of: latest, deadline, views, alphabetical.");
        }
        Sort.Direction sortDirection = Sort.Direction.DESC;
        if (StringUtils.hasText(direction)) {
            sortDirection = Sort.Direction.fromOptionalString(direction)
                    .orElseThrow(() -> new IllegalArgumentException("direction must be asc or desc."));
        }
        Sort ordering = switch (sortProperty) {
            case "title", "alphabetical" -> Sort.by(sortDirection, "title");
            case "organization" -> Sort.by(sortDirection, "organization");
            case "views" -> Sort.by(sortDirection, "viewsCount");
            case "deadline" -> JpaSort.unsafe(sortDirection,
                    "function('jsonb_extract_path_text', importantDates, 'applicationEndDate')");
            default -> Sort.by(sortDirection, "createdAt");
        };
        Pageable pageable = PageRequest.of(page, size, ordering);

        Specification<JobEntity> specification = Specification.allOf();
        specification = specification.and((root, criteria, builder) ->
                builder.notEqual(builder.upper(root.get("status")), "CLOSED"));
        if (StringUtils.hasText(query)) {
            String pattern = "%" + escapeLike(query.trim().toLowerCase(Locale.ROOT)) + "%";
            specification = specification.and((root, criteria, builder) -> builder.or(
                    builder.like(builder.lower(root.get("title")), pattern, '\\'),
                    builder.like(builder.lower(root.get("shortSummary")), pattern, '\\'),
                    builder.like(builder.lower(root.get("organization")), pattern, '\\'),
                    builder.like(builder.lower(root.get("location")), pattern, '\\'),
                    builder.like(builder.lower(root.get("qualificationSummary")), pattern, '\\')));
        }
        if (StringUtils.hasText(category)) {
            specification = specification.and((root, criteria, builder) ->
                    builder.equal(builder.lower(root.get("category")), category.trim().toLowerCase(Locale.ROOT)));
        }
        if (StringUtils.hasText(status)) {
            specification = specification.and((root, criteria, builder) ->
                    builder.equal(builder.lower(root.get("status")), status.trim().toLowerCase(Locale.ROOT)));
        }
        if (StringUtils.hasText(qualification)) {
            String pattern = "%" + escapeLike(qualification.trim().toLowerCase(Locale.ROOT)) + "%";
            specification = specification.and((root, criteria, builder) ->
                    builder.like(builder.lower(root.get("qualificationSummary")), pattern, '\\'));
        }
        if (StringUtils.hasText(location)) {
            String pattern = "%" + escapeLike(location.trim().toLowerCase(Locale.ROOT)) + "%";
            specification = specification.and((root, criteria, builder) ->
                    builder.like(builder.lower(root.get("location")), pattern, '\\'));
        }
        return repository.findAll(specification, pageable).map(JobResponse::from);
    }

    public JobResponse findBySlug(String slug) {
        return repository.findBySlugAndStatusNotIgnoreCase(slug.trim().toLowerCase(Locale.ROOT), "CLOSED")
                .map(JobResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("Job not found."));
    }

    public List<JobResponse> related(String slug, int limit) {
        JobEntity job = repository.findBySlugAndStatusNotIgnoreCase(slug.trim().toLowerCase(Locale.ROOT), "CLOSED")
                .orElseThrow(() -> new EntityNotFoundException("Job not found."));
        return repository.findAllByCategoryIgnoreCaseAndStatusInAndSlugNotIgnoreCaseOrderByCreatedAtDesc(
                        job.getCategory(), List.of("OPEN", "ENDING_SOON", "ADMIT_CARD_OUT", "RESULT_OUT", "ANSWER_KEY_OUT"),
                        job.getSlug(), PageRequest.of(0, limit))
                .stream()
                .map(JobResponse::from)
                .toList();
    }

    private static String escapeLike(String value) {
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}

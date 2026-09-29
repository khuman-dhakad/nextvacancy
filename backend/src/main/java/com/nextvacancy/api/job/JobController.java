package com.nextvacancy.api.job;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {
    private final JobCatalogService catalog;

    public JobController(JobCatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping
    public Page<JobResponse> search(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            @RequestParam(required = false) @Size(max = 128) String q,
            @RequestParam(required = false) @Size(max = 64) String category,
            @RequestParam(required = false) @Size(max = 64) String status,
            @RequestParam(required = false) @Size(max = 128) String qualification,
            @RequestParam(required = false) @Size(max = 255) String location,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        return catalog.search(page, size, q, category, status, qualification, location, sort, direction);
    }

    @GetMapping("/{slug}")
    public JobResponse findBySlug(@PathVariable @Size(max = 255) String slug) {
        return catalog.findBySlug(slug);
    }

    @GetMapping("/{slug}/related")
    public java.util.List<JobResponse> related(@PathVariable @Size(max = 255) String slug) {
        return catalog.related(slug, 4);
    }
}

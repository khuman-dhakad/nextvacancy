package com.nextvacancy.api.organization;

import java.util.List;

import com.nextvacancy.api.job.JobResponse;
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
@RequestMapping("/api/v1/organizations")
public class OrganizationController {
    private final OrganizationService organizations;

    public OrganizationController(OrganizationService organizations) {
        this.organizations = organizations;
    }

    @GetMapping
    public List<OrganizationResponse> list() {
        return organizations.list();
    }

    @GetMapping("/{slug}")
    public OrganizationResponse find(@PathVariable @Size(max = 255) String slug) {
        return organizations.find(slug);
    }

    @GetMapping("/{slug}/jobs")
    public Page<JobResponse> jobs(
            @PathVariable @Size(max = 255) String slug,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "12") @Min(1) @Max(100) int size) {
        return organizations.jobs(slug, page, size);
    }

    @GetMapping("/{slug}/related")
    public List<OrganizationResponse> related(
            @PathVariable @Size(max = 255) String slug,
            @RequestParam(defaultValue = "3") @Min(1) @Max(20) int limit) {
        return organizations.related(slug, limit);
    }
}

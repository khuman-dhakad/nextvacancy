package com.nextvacancy.api.admin;

import java.util.List;

import com.nextvacancy.api.auth.JwtPrincipal;
import com.nextvacancy.api.category.CategoryResponse;
import com.nextvacancy.api.job.JobResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminService.dashboard();
    }

    @GetMapping("/jobs")
    public Page<JobResponse> jobs(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "25") @Min(1) @Max(100) int size) {
        return adminService.jobs(page, size);
    }

    @GetMapping("/jobs/{id}")
    public JobResponse job(@PathVariable @jakarta.validation.constraints.Size(max = 128) String id) {
        return adminService.job(id);
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobWriteRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createJob(request, actor(principal)));
    }

    @PutMapping("/jobs/{id}")
    public JobResponse updateJob(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @Valid @RequestBody JobWriteRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.updateJob(id, request, actor(principal));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        adminService.deleteJob(id, actor(principal));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/jobs/bulk/status")
    public int bulkUpdateJobStatus(
            @Valid @RequestBody BulkJobStatusRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.bulkUpdateJobStatus(request, actor(principal));
    }

    @PostMapping("/jobs/bulk/delete")
    public int bulkDeleteJobs(
            @Valid @RequestBody BulkIdsRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.bulkDeleteJobs(request, actor(principal));
    }

    @PostMapping("/jobs/{id}/duplicate")
    public ResponseEntity<JobResponse> duplicateJob(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.duplicateJob(id, actor(principal)));
    }

    @PatchMapping("/jobs/{id}/status")
    public JobResponse updateJobStatus(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @Valid @RequestBody JobStatusRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.updateJobStatus(id, request.status(), actor(principal));
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return adminService.categories();
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryWriteRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createCategory(request, actor(principal)));
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @Valid @RequestBody CategoryWriteRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.updateCategory(id, request, actor(principal));
    }

    @PatchMapping("/categories/{id}/status")
    public CategoryResponse updateCategoryStatus(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @RequestBody MasterDataStatusRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.updateCategoryStatus(id, request, actor(principal));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        adminService.deleteCategory(id, actor(principal));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/categories/bulk/status")
    public int bulkUpdateCategoryStatus(
            @Valid @RequestBody BulkMasterDataStatusRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.bulkUpdateCategoryStatus(request, actor(principal));
    }

    @PostMapping("/categories/bulk/delete")
    public int bulkDeleteCategories(
            @Valid @RequestBody BulkIdsRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.bulkDeleteCategories(request, actor(principal));
    }

    @GetMapping("/organizations")
    public List<AdminOrganizationResponse> organizations() {
        return adminService.organizations();
    }

    @PostMapping("/organizations")
    public ResponseEntity<AdminOrganizationResponse> createOrganization(
            @Valid @RequestBody OrganizationWriteRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.createOrganization(request, actor(principal)));
    }

    @PutMapping("/organizations/{id}")
    public AdminOrganizationResponse updateOrganization(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @Valid @RequestBody OrganizationWriteRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.updateOrganization(id, request, actor(principal));
    }

    @PatchMapping("/organizations/{id}/status")
    public AdminOrganizationResponse updateOrganizationStatus(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @RequestBody MasterDataStatusRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.updateOrganizationStatus(id, request, actor(principal));
    }

    @DeleteMapping("/organizations/{id}")
    public ResponseEntity<Void> deleteOrganization(
            @PathVariable @jakarta.validation.constraints.Size(max = 128) String id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        adminService.deleteOrganization(id, actor(principal));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/organizations/bulk/status")
    public int bulkUpdateOrganizationStatus(
            @Valid @RequestBody BulkMasterDataStatusRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.bulkUpdateOrganizationStatus(request, actor(principal));
    }

    @PostMapping("/organizations/bulk/delete")
    public int bulkDeleteOrganizations(
            @Valid @RequestBody BulkIdsRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return adminService.bulkDeleteOrganizations(request, actor(principal));
    }

    @GetMapping("/analytics")
    public AdminAnalyticsResponse analytics() {
        return adminService.analytics();
    }

    @GetMapping("/activity")
    public List<AuditLogResponse> activity(@RequestParam(defaultValue = "8") @Min(1) @Max(100) int limit) {
        return adminService.activity(limit);
    }

    private static String actor(JwtPrincipal principal) {
        return principal.id().startsWith("admin:")
                ? principal.id().substring("admin:".length())
                : principal.id();
    }
}

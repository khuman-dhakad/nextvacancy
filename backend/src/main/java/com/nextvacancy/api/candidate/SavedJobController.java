package com.nextvacancy.api.candidate;

import java.util.List;

import com.nextvacancy.api.auth.JwtPrincipal;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/candidate/saved-jobs")
@PreAuthorize("hasRole('CANDIDATE')")
@Validated
public class SavedJobController {
    private final SavedJobService savedJobs;

    public SavedJobController(SavedJobService savedJobs) {
        this.savedJobs = savedJobs;
    }

    @GetMapping
    public List<SavedJobResponse> list(@AuthenticationPrincipal JwtPrincipal principal) {
        return savedJobs.list(principal.id());
    }

    @PutMapping("/{jobId}")
    public SavedJobResponse save(
            @AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable @Size(max = 128) String jobId) {
        return savedJobs.save(principal.id(), jobId);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> remove(
            @AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable @Size(max = 128) String jobId) {
        savedJobs.remove(principal.id(), jobId);
        return ResponseEntity.noContent().build();
    }
}

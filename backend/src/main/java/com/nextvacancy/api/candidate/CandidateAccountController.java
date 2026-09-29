package com.nextvacancy.api.candidate;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nextvacancy.api.auth.JwtPrincipal;

@RestController
@RequestMapping("/api/v1/candidate")
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateAccountController {
    private final CandidateAccountService service;

    public CandidateAccountController(CandidateAccountService service) {
        this.service = service;
    }

    @GetMapping("/profile")
    public CandidateProfileResponse profile(@AuthenticationPrincipal JwtPrincipal principal) {
        return service.profile(principal.id());
    }

    @PutMapping("/profile")
    public CandidateProfileResponse updateProfile(
            @AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody CandidateProfileRequest request) {
        return service.updateProfile(principal.id(), request);
    }

    @GetMapping("/notifications")
    public List<CandidateNotificationResponse> notifications(@AuthenticationPrincipal JwtPrincipal principal) {
        return service.listNotifications(principal.id());
    }

    @PatchMapping("/notifications/{id}/read")
    public CandidateNotificationResponse markRead(
            @AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable String id) {
        return service.markNotificationRead(principal.id(), id);
    }

    @GetMapping("/notification-preferences")
    public List<CandidateNotificationPreferenceResponse> notificationPreferences(
            @AuthenticationPrincipal JwtPrincipal principal) {
        return service.listNotificationPreferences(principal.id());
    }

    @PutMapping("/notification-preferences")
    public List<CandidateNotificationPreferenceResponse> updateNotificationPreferences(
            @AuthenticationPrincipal JwtPrincipal principal,
            @RequestBody List<CandidateNotificationPreferenceRequest> request) {
        return service.updateNotificationPreferences(principal.id(), request);
    }
}

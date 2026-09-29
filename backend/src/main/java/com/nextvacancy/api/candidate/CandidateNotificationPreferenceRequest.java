package com.nextvacancy.api.candidate;

public record CandidateNotificationPreferenceRequest(
        String category,
        String label,
        Boolean emailEnabled,
        Boolean whatsappEnabled,
        Boolean pushEnabled) {
}

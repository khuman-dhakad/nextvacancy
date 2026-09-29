package com.nextvacancy.api.candidate;

import java.time.OffsetDateTime;

public record CandidateNotificationPreferenceResponse(
        String id,
        String category,
        String label,
        boolean emailEnabled,
        boolean whatsappEnabled,
        boolean pushEnabled,
        OffsetDateTime updatedAt) {
}

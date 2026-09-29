package com.nextvacancy.api.candidate;

import java.time.OffsetDateTime;

public record CandidateNotificationResponse(
        String id,
        String category,
        String title,
        String message,
        String linkUrl,
        boolean read,
        OffsetDateTime createdAt,
        OffsetDateTime readAt) {
}

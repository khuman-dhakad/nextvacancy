package com.nextvacancy.api.candidate;

import java.time.OffsetDateTime;

public record CandidateProfileResponse(
        String id,
        String fullName,
        String email,
        String mobile,
        String avatarUrl,
        String preferredState,
        String preferredCategory,
        String qualification,
        boolean profileVisible,
        boolean showMobile,
        String accountStatus,
        OffsetDateTime updatedAt) {
}

package com.nextvacancy.api.candidate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record CandidateProfileRequest(
        @Size(min = 2, max = 255) String fullName,
        @Email @Size(max = 255) String email,
        @Size(max = 24) String mobile,
        @Size(max = 255) String preferredState,
        @Size(max = 255) String preferredCategory,
        @Size(max = 255) String qualification,
        @Size(max = 1024) String avatarUrl,
        Boolean profileVisible,
        Boolean showMobile) {
}

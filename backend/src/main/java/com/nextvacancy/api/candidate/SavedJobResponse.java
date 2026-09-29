package com.nextvacancy.api.candidate;

import java.time.OffsetDateTime;

import com.nextvacancy.api.job.JobResponse;

public record SavedJobResponse(String id, OffsetDateTime savedAt, JobResponse job) {
    public static SavedJobResponse from(SavedJobEntity savedJob) {
        return new SavedJobResponse(savedJob.getId(), savedJob.getSavedAt(), JobResponse.from(savedJob.getJob()));
    }
}

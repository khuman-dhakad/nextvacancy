package com.nextvacancy.api.candidate;

import java.util.List;
import java.util.UUID;

import com.nextvacancy.api.auth.UserEntity;
import com.nextvacancy.api.auth.UserRepository;
import com.nextvacancy.api.job.JobEntity;
import com.nextvacancy.api.job.JobRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SavedJobService {
    private final SavedJobRepository savedJobs;
    private final UserRepository users;
    private final JobRepository jobs;

    public SavedJobService(SavedJobRepository savedJobs, UserRepository users, JobRepository jobs) {
        this.savedJobs = savedJobs;
        this.users = users;
        this.jobs = jobs;
    }

    @Transactional(readOnly = true)
    public List<SavedJobResponse> list(String candidateId) {
        return savedJobs.findAllByUser_IdOrderBySavedAtDesc(candidateId).stream()
                .map(SavedJobResponse::from)
                .toList();
    }

    @Transactional
    public SavedJobResponse save(String candidateId, String jobId) {
        UserEntity candidate = users.findByIdForUpdate(candidateId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found."));
        JobEntity job = jobs.findById(jobId)
                .filter(candidateJob -> !"CLOSED".equalsIgnoreCase(candidateJob.getStatus()))
                .orElseThrow(() -> new EntityNotFoundException("Job not found."));

        return savedJobs.findByUser_IdAndJob_Id(candidateId, jobId)
                .map(SavedJobResponse::from)
                .orElseGet(() -> SavedJobResponse.from(
                        savedJobs.save(new SavedJobEntity(UUID.randomUUID().toString(), candidate, job))));
    }

    @Transactional
    public void remove(String candidateId, String jobId) {
        users.findByIdForUpdate(candidateId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found."));
        savedJobs.deleteByUser_IdAndJob_Id(candidateId, jobId);
    }
}

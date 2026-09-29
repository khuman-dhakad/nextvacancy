package com.nextvacancy.api.candidate;

import java.time.OffsetDateTime;

import com.nextvacancy.api.auth.UserEntity;
import com.nextvacancy.api.job.JobEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "saved_jobs")
public class SavedJobEntity {
    @Id
    @Column(length = 128)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private JobEntity job;

    @Column(name = "saved_at", nullable = false)
    private OffsetDateTime savedAt;

    protected SavedJobEntity() {
    }

    public SavedJobEntity(String id, UserEntity user, JobEntity job) {
        this.id = id;
        this.user = user;
        this.job = job;
        this.savedAt = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public UserEntity getUser() { return user; }
    public JobEntity getJob() { return job; }
    public OffsetDateTime getSavedAt() { return savedAt; }
}

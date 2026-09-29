package com.nextvacancy.api.candidate;

import java.time.OffsetDateTime;

import com.nextvacancy.api.auth.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "candidate_notifications")
public class CandidateNotificationEntity {
    @Id
    @Column(length = 128)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "category", nullable = false, length = 64)
    private String category;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "link_url", length = 1024)
    private String linkUrl;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "read_at")
    private OffsetDateTime readAt;

    protected CandidateNotificationEntity() {
    }

    public CandidateNotificationEntity(String id, UserEntity user, String category, String title, String message, String linkUrl) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.title = title;
        this.message = message;
        this.linkUrl = linkUrl;
        this.isRead = false;
        this.createdAt = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public UserEntity getUser() { return user; }
    public String getCategory() { return category; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getLinkUrl() { return linkUrl; }
    public boolean isRead() { return isRead; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getReadAt() { return readAt; }

    public void markRead() {
        this.isRead = true;
        this.readAt = OffsetDateTime.now();
    }
}

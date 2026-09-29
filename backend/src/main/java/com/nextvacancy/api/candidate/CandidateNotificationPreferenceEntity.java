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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "candidate_notification_preferences",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "category"}))
public class CandidateNotificationPreferenceEntity {
    @Id
    @Column(length = 128)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "category", nullable = false, length = 64)
    private String category;

    @Column(name = "label", nullable = false, length = 255)
    private String label;

    @Column(name = "email_enabled", nullable = false)
    private boolean emailEnabled;

    @Column(name = "whatsapp_enabled", nullable = false)
    private boolean whatsappEnabled;

    @Column(name = "push_enabled", nullable = false)
    private boolean pushEnabled;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected CandidateNotificationPreferenceEntity() {
    }

    public CandidateNotificationPreferenceEntity(String id, UserEntity user, String category, String label,
            boolean emailEnabled, boolean whatsappEnabled, boolean pushEnabled) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.label = label;
        this.emailEnabled = emailEnabled;
        this.whatsappEnabled = whatsappEnabled;
        this.pushEnabled = pushEnabled;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public String getId() { return id; }
    public UserEntity getUser() { return user; }
    public String getCategory() { return category; }
    public String getLabel() { return label; }
    public boolean isEmailEnabled() { return emailEnabled; }
    public boolean isWhatsappEnabled() { return whatsappEnabled; }
    public boolean isPushEnabled() { return pushEnabled; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void setLabel(String label) { this.label = label; }
    public void setEmailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; }
    public void setWhatsappEnabled(boolean whatsappEnabled) { this.whatsappEnabled = whatsappEnabled; }
    public void setPushEnabled(boolean pushEnabled) { this.pushEnabled = pushEnabled; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}

package com.nextvacancy.api.candidate;

import java.time.OffsetDateTime;

import com.nextvacancy.api.auth.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "candidate_profiles")
public class CandidateProfileEntity {
    @Id
    @Column(length = 128)
    private String id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @Column(name = "avatar_url", length = 1024)
    private String avatarUrl;

    @Column(name = "preferred_state", length = 255)
    private String preferredState;

    @Column(name = "preferred_category", length = 255)
    private String preferredCategory;

    @Column(name = "qualification", length = 255)
    private String qualification;

    @Column(name = "profile_visible", nullable = false)
    private boolean profileVisible = true;

    @Column(name = "show_mobile", nullable = false)
    private boolean showMobile = false;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected CandidateProfileEntity() {
    }

    public CandidateProfileEntity(String id, UserEntity user) {
        this.id = id;
        this.user = user;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = this.createdAt;
        this.profileVisible = true;
        this.showMobile = false;
    }

    public String getId() { return id; }
    public UserEntity getUser() { return user; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getPreferredState() { return preferredState; }
    public String getPreferredCategory() { return preferredCategory; }
    public String getQualification() { return qualification; }
    public boolean isProfileVisible() { return profileVisible; }
    public boolean isShowMobile() { return showMobile; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void setId(String id) { this.id = id; }
    public void setUser(UserEntity user) { this.user = user; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public void setPreferredState(String preferredState) { this.preferredState = preferredState; }
    public void setPreferredCategory(String preferredCategory) { this.preferredCategory = preferredCategory; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public void setProfileVisible(boolean profileVisible) { this.profileVisible = profileVisible; }
    public void setShowMobile(boolean showMobile) { this.showMobile = showMobile; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}

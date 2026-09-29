package com.nextvacancy.api.auth;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @Column(length = 128)
    private String id;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 32)
    private String mobile;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 64)
    private String role;

    @Column(name = "is_email_verified", nullable = false)
    private boolean emailVerified;

    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts;

    @Column(name = "locked_until")
    private OffsetDateTime lockedUntil;

    @Column(name = "email_verification_token_hash", length = 128)
    private String emailVerificationTokenHash;

    @Column(name = "email_verification_token_expires_at")
    private OffsetDateTime emailVerificationTokenExpiresAt;

    @Column(name = "password_reset_token_hash", length = 128)
    private String passwordResetTokenHash;

    @Column(name = "password_reset_token_expires_at")
    private OffsetDateTime passwordResetTokenExpiresAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected UserEntity() {
    }

    public UserEntity(String id, String fullName, String email, String mobile, String passwordHash) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobile = mobile;
        this.passwordHash = passwordHash;
        this.role = "CANDIDATE";
        this.emailVerified = false;
        this.failedLoginAttempts = 0;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getMobile() { return mobile; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public boolean isEmailVerified() { return emailVerified; }
    public int getFailedLoginAttempts() { return failedLoginAttempts; }
    public OffsetDateTime getLockedUntil() { return lockedUntil; }
    public String getEmailVerificationTokenHash() { return emailVerificationTokenHash; }
    public OffsetDateTime getEmailVerificationTokenExpiresAt() { return emailVerificationTokenExpiresAt; }
    public String getPasswordResetTokenHash() { return passwordResetTokenHash; }
    public OffsetDateTime getPasswordResetTokenExpiresAt() { return passwordResetTokenExpiresAt; }
    public OffsetDateTime getCreatedAt() { return createdAt; }

    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public void setFailedLoginAttempts(int failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; }
    public void setLockedUntil(OffsetDateTime lockedUntil) { this.lockedUntil = lockedUntil; }
    public void setEmailVerificationTokenHash(String tokenHash) { this.emailVerificationTokenHash = tokenHash; }
    public void setEmailVerificationTokenExpiresAt(OffsetDateTime expiry) { this.emailVerificationTokenExpiresAt = expiry; }
    public void setPasswordResetTokenHash(String tokenHash) { this.passwordResetTokenHash = tokenHash; }
    public void setPasswordResetTokenExpiresAt(OffsetDateTime expiry) { this.passwordResetTokenExpiresAt = expiry; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}

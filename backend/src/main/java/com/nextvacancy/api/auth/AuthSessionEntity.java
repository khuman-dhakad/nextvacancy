package com.nextvacancy.api.auth;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "api_sessions")
public class AuthSessionEntity {
    @Id
    @Column(length = 128)
    private String id;

    @Column(name = "principal_id", nullable = false, length = 128)
    private String principalId;

    @Column(nullable = false, length = 64)
    private String role;

    @Column(name = "refresh_token_hash", nullable = false, unique = true, length = 128)
    private String refreshTokenHash;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "revoked_at")
    private OffsetDateTime revokedAt;

    protected AuthSessionEntity() {
    }

    public AuthSessionEntity(String id, String principalId, String role, String refreshTokenHash,
            OffsetDateTime expiresAt) {
        this.id = id;
        this.principalId = principalId;
        this.role = role;
        this.refreshTokenHash = refreshTokenHash;
        this.expiresAt = expiresAt;
        this.createdAt = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public String getPrincipalId() { return principalId; }
    public String getRole() { return role; }
    public String getRefreshTokenHash() { return refreshTokenHash; }
    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public OffsetDateTime getRevokedAt() { return revokedAt; }

    public void setRefreshTokenHash(String refreshTokenHash) { this.refreshTokenHash = refreshTokenHash; }
    public void setExpiresAt(OffsetDateTime expiresAt) { this.expiresAt = expiresAt; }
    public void setRevokedAt(OffsetDateTime revokedAt) { this.revokedAt = revokedAt; }
}

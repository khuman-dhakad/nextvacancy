package com.nextvacancy.api.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sessions")
public class LegacySessionEntity {
    @Id
    @Column(length = 128)
    private String id;

    @Column(name = "user_id", nullable = false, length = 128)
    private String userId;

    protected LegacySessionEntity() {
    }

    public String getUserId() { return userId; }
}

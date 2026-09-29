package com.nextvacancy.api.admin;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_logs")
public class AuditLogEntity {
    @Id
    @Column(length = 128)
    private String id;

    @Column(nullable = false, length = 255)
    private String actor;

    @Column(nullable = false, length = 64)
    private String action;

    @Column(nullable = false, length = 64)
    private String entity;

    @Column(name = "entity_id", length = 128)
    private String entityId;

    @Column(name = "entity_title", columnDefinition = "text")
    private String entityTitle;

    @Column(columnDefinition = "text")
    private String details;

    @Column(name = "timestamp", nullable = false)
    private OffsetDateTime timestamp;

    protected AuditLogEntity() {
    }

    public AuditLogEntity(
            String id, String actor, String action, String entity, String entityId,
            String entityTitle, String details, OffsetDateTime timestamp) {
        this.id = id;
        this.actor = actor;
        this.action = action;
        this.entity = entity;
        this.entityId = entityId;
        this.entityTitle = entityTitle;
        this.details = details;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public String getActor() { return actor; }
    public String getAction() { return action; }
    public String getEntity() { return entity; }
    public String getEntityId() { return entityId; }
    public String getEntityTitle() { return entityTitle; }
    public String getDetails() { return details; }
    public OffsetDateTime getTimestamp() { return timestamp; }
}

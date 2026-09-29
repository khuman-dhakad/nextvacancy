package com.nextvacancy.api.admin;

import java.time.OffsetDateTime;

public record AuditLogResponse(
        String id,
        String action,
        String entity,
        String entityId,
        String entityTitle,
        String details,
        String actor,
        OffsetDateTime timestamp) {

    public static AuditLogResponse from(AuditLogEntity audit) {
        return new AuditLogResponse(
                audit.getId(), audit.getAction(), audit.getEntity(), audit.getEntityId(),
                audit.getEntityTitle(), audit.getDetails(), audit.getActor(), audit.getTimestamp());
    }
}

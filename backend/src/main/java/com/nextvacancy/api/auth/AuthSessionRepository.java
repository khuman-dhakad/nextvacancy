package com.nextvacancy.api.auth;

import java.time.OffsetDateTime;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface AuthSessionRepository extends JpaRepository<AuthSessionEntity, String> {
    Optional<AuthSessionEntity> findByIdAndRevokedAtIsNullAndExpiresAtAfter(String id, OffsetDateTime now);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AuthSessionEntity s where s.refreshTokenHash = :tokenHash "
            + "and s.revokedAt is null and s.expiresAt > :now")
    Optional<AuthSessionEntity> findActiveByRefreshHashForUpdate(
            @Param("tokenHash") String tokenHash, @Param("now") OffsetDateTime now);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AuthSessionEntity s where s.refreshTokenHash = :tokenHash and s.revokedAt is null")
    Optional<AuthSessionEntity> findByRefreshHashForUpdate(@Param("tokenHash") String tokenHash);

    @Modifying
    @Transactional
    @Query("update AuthSessionEntity s set s.revokedAt = :now "
            + "where s.principalId = :principalId and s.revokedAt is null")
    int revokeActiveByPrincipalId(@Param("principalId") String principalId, @Param("now") OffsetDateTime now);
}

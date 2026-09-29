package com.nextvacancy.api.auth;

import java.time.OffsetDateTime;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByEmailIgnoreCase(String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from UserEntity u where u.id = :id")
    Optional<UserEntity> findByIdForUpdate(@Param("id") String id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from UserEntity u where lower(u.email) = lower(:email)")
    Optional<UserEntity> findByEmailIgnoreCaseForUpdate(@Param("email") String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from UserEntity u where u.emailVerificationTokenHash = :tokenHash "
            + "and u.emailVerificationTokenExpiresAt > :now")
    Optional<UserEntity> findValidVerificationTokenForUpdate(
            @Param("tokenHash") String tokenHash, @Param("now") OffsetDateTime now);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from UserEntity u where u.passwordResetTokenHash = :tokenHash "
            + "and u.passwordResetTokenExpiresAt > :now")
    Optional<UserEntity> findValidPasswordResetTokenForUpdate(
            @Param("tokenHash") String tokenHash, @Param("now") OffsetDateTime now);
}

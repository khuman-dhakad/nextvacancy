package com.nextvacancy.api.auth;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LegacySessionRepository extends JpaRepository<LegacySessionEntity, String> {
    void deleteAllByUserId(String userId);
}

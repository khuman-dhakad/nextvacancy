package com.nextvacancy.api.candidate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateNotificationPreferenceRepository extends JpaRepository<CandidateNotificationPreferenceEntity, String> {
    List<CandidateNotificationPreferenceEntity> findAllByUser_IdOrderByCategoryAsc(String userId);

    Optional<CandidateNotificationPreferenceEntity> findByUser_IdAndCategory(String userId, String category);
}

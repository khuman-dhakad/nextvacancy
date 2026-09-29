package com.nextvacancy.api.candidate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateNotificationRepository extends JpaRepository<CandidateNotificationEntity, String> {
    List<CandidateNotificationEntity> findAllByUser_IdOrderByCreatedAtDesc(String userId);

    Optional<CandidateNotificationEntity> findByIdAndUser_Id(String id, String userId);
}

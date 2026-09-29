package com.nextvacancy.api.candidate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedJobRepository extends JpaRepository<SavedJobEntity, String> {
    @EntityGraph(attributePaths = "job")
    List<SavedJobEntity> findAllByUser_IdOrderBySavedAtDesc(String userId);

    Optional<SavedJobEntity> findByUser_IdAndJob_Id(String userId, String jobId);

    void deleteByUser_IdAndJob_Id(String userId, String jobId);
}

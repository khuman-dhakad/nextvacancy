package com.nextvacancy.api.candidate;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfileEntity, String> {
    Optional<CandidateProfileEntity> findByUser_Id(String userId);
}

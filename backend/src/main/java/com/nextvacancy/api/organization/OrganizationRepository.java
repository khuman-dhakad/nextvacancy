package com.nextvacancy.api.organization;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrganizationRepository extends JpaRepository<OrganizationEntity, String> {
    List<OrganizationEntity> findAllByActiveTrueOrderByCreatedAtDesc();
    boolean existsBySlugIgnoreCase(String slug);
    boolean existsBySlugIgnoreCaseAndIdNot(String slug, String id);

    Optional<OrganizationEntity> findFirstByActiveTrueAndSlugIgnoreCaseOrActiveTrueAndShortNameIgnoreCase(
            String slug, String shortName);

    @Query("""
            select o from OrganizationEntity o
            where o.active = true and lower(o.slug) <> lower(:slug)
              and o.categoryType = :categoryType
            order by o.createdAt desc
            """)
    List<OrganizationEntity> findRelatedByCategory(
            @Param("slug") String slug, @Param("categoryType") String categoryType,
            org.springframework.data.domain.Pageable pageable);

    @Query("""
            select o from OrganizationEntity o
            where o.active = true and lower(o.slug) <> lower(:slug)
            order by o.createdAt desc
            """)
    List<OrganizationEntity> findOtherActive(
            @Param("slug") String slug, org.springframework.data.domain.Pageable pageable);
}

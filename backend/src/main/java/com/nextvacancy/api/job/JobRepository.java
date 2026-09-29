package com.nextvacancy.api.job;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobRepository extends JpaRepository<JobEntity, String>, JpaSpecificationExecutor<JobEntity> {
    @Query("select count(j) from JobEntity j where upper(j.status) <> 'CLOSED'")
    long countOpenJobs();

    @Query("select count(j) from JobEntity j where j.featured = true")
    long countFeaturedJobs();

    @Query("select coalesce(sum(j.viewsCount), 0) from JobEntity j")
    long sumViewsCount();

    @Query("select avg(j.viewsCount) from JobEntity j")
    Double averageViewsCount();

    Optional<JobEntity> findBySlug(String slug);
    boolean existsBySlugIgnoreCase(String slug);
    boolean existsBySlugIgnoreCaseAndIdNot(String slug, String id);

    Optional<JobEntity> findBySlugAndStatusNotIgnoreCase(String slug, String hiddenStatus);
    List<JobEntity> findAllByCategoryIgnoreCaseAndStatusInAndSlugNotIgnoreCaseOrderByCreatedAtDesc(
            String category, java.util.Collection<String> statuses, String slug, Pageable pageable);

    @Query("""
            select j from JobEntity j
            where upper(j.status) <> 'CLOSED'
              and (lower(j.organization) like :shortPattern
                or lower(j.organization) like :namePattern
                or lower(j.title) like :shortPattern)
            """)
    long countPublicOrganizationJobs(
            @Param("shortPattern") String shortPattern, @Param("namePattern") String namePattern);

    @Query("""
            select count(j) from JobEntity j
            where upper(j.status) in (upper(:firstStatus), upper(:secondStatus))
              and (lower(j.organization) like :shortPattern
                or lower(j.organization) like :namePattern
                or lower(j.title) like :shortPattern)
            """)
    long countPublicOrganizationJobsByStatus(
            @Param("shortPattern") String shortPattern, @Param("namePattern") String namePattern,
            @Param("firstStatus") String firstStatus, @Param("secondStatus") String secondStatus);

    @Query("""
            select count(j) from JobEntity j
            where upper(j.status) <> 'CLOSED'
              and (upper(j.status) = upper(:status) or lower(j.category) = lower(:category))
              and (lower(j.organization) like :shortPattern
                or lower(j.organization) like :namePattern
                or lower(j.title) like :shortPattern)
            """)
    long countPublicOrganizationJobsByStatusOrCategory(
            @Param("shortPattern") String shortPattern, @Param("namePattern") String namePattern,
            @Param("status") String status, @Param("category") String category);

    @Query("""
            select j from JobEntity j
            where upper(j.status) <> 'CLOSED'
              and (lower(j.organization) like :pattern
                or lower(j.title) like :pattern
                or lower(j.shortSummary) like :pattern)
            """)
    Page<JobEntity> findPublicJobsByOrganizationPattern(
            @Param("pattern") String pattern, Pageable pageable);
}

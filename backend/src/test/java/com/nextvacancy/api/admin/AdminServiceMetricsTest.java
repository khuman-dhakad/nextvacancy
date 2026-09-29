package com.nextvacancy.api.admin;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.nextvacancy.api.category.CategoryRepository;
import com.nextvacancy.api.job.JobRepository;
import com.nextvacancy.api.organization.OrganizationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AdminServiceMetricsTest {
    @Mock
    private JobRepository jobs;

    @Mock
    private CategoryRepository categories;

    @Mock
    private OrganizationRepository organizations;

    @Mock
    private AuditLogRepository auditLogs;

    private AdminService service;

    @BeforeEach
    void setUp() {
        service = new AdminService(jobs, categories, organizations, auditLogs);
    }

    @Test
    void dashboardCalculatesMetricsInDatabaseWithoutLoadingJobs() {
        given(jobs.count()).willReturn(12L);
        given(jobs.countOpenJobs()).willReturn(8L);
        given(jobs.countFeaturedJobs()).willReturn(3L);
        given(jobs.sumViewsCount()).willReturn(2_400L);
        given(organizations.count()).willReturn(4L);
        given(categories.countByActiveTrue()).willReturn(6L);

        AdminDashboardResponse response = service.dashboard();

        assertThat(response).isEqualTo(new AdminDashboardResponse(12, 8, 4, 6, 2_400, 3));
        verify(jobs, never()).findAll();
    }

    @Test
    void analyticsCalculatesAverageInDatabaseWithoutLoadingJobs() {
        given(jobs.count()).willReturn(12L);
        given(jobs.countOpenJobs()).willReturn(8L);
        given(jobs.averageViewsCount()).willReturn(200.0);
        given(organizations.count()).willReturn(4L);
        given(categories.countByActiveTrue()).willReturn(6L);

        AdminAnalyticsResponse response = service.analytics();

        assertThat(response).isEqualTo(new AdminAnalyticsResponse(12, 8, 4, 6, 200.0));
        verify(jobs, never()).findAll();
    }

    @Test
    void analyticsReportsZeroAverageForAnEmptyCatalog() {
        given(jobs.averageViewsCount()).willReturn(null);

        AdminAnalyticsResponse response = service.analytics();

        assertThat(response.averageViewsPerJob()).isZero();
    }
}

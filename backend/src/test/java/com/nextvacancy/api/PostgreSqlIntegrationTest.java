package com.nextvacancy.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;

import java.util.Base64;
import java.util.UUID;

import com.nextvacancy.api.auth.AuthResponse;
import com.nextvacancy.api.auth.AuthRateLimitService;
import com.nextvacancy.api.auth.AuthUserResponse;
import com.nextvacancy.api.auth.CurrentPrincipalResponse;
import com.nextvacancy.api.auth.TransactionalEmailService;
import com.nextvacancy.api.candidate.SavedJobResponse;
import com.nextvacancy.api.job.JobCatalogService;
import com.nextvacancy.api.job.JobRepository;
import com.nextvacancy.api.organization.OrganizationResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers(disabledWithoutDocker = true)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PostgreSqlIntegrationTest {
    private static final String ADMIN_TEST_PASSWORD = "Integration-Test-Only1!";
    private static final String JWT_SECRET = Base64.getEncoder().encodeToString(new byte[32]);

    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("nextvacancy_integration")
            .withUsername("integration_test")
            .withPassword("integration_test_only");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("app.cors.allowed-origins", () -> "https://frontend.example.invalid");
        registry.add("app.jwt.secret", () -> JWT_SECRET);
        registry.add("app.jwt.issuer", () -> "nextvacancy");
        registry.add("app.jwt.access-token-ttl", () -> "900");
        registry.add("app.jwt.refresh-token-ttl", () -> "86400");
        registry.add("app.admin.username", () -> "integration-admin");
        registry.add("app.admin.email", () -> "integration-admin@example.invalid");
        registry.add("app.admin.password-hash", () ->
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder(4).encode(ADMIN_TEST_PASSWORD));
        registry.add("app.email.api-key", () -> "integration-only-resend-key");
        registry.add("app.email.from", () -> "NextVacancy Integration <test@example.invalid>");
        registry.add("app.public-url", () -> "https://frontend.example.invalid");
    }

    @Autowired private JdbcTemplate jdbc;
    @Autowired private JobCatalogService jobs;
    @Autowired private JobRepository jobRepository;
    @Autowired private TestRestTemplate http;
    @LocalServerPort private int port;
    @MockitoBean private TransactionalEmailService emailService;
    @Autowired private AuthRateLimitService authRateLimits;

    @Test
    void readsExistingCatalogSchemaWithHibernateValidationAndHidesDrafts() {
        jdbc.update("""
                INSERT INTO jobs (id, slug, title, short_summary, organization, category, status,
                    location, total_vacancies, salary_or_stipend, qualification_summary,
                    important_dates, important_links)
                VALUES ('integration-open', 'integration-open-role', 'Integration Role',
                    'PostgreSQL integration fixture', 'Integration Organization', 'government', 'OPEN',
                    'All India', '1', 'As per rules', 'Graduate',
                    '{}'::jsonb, '[]'::jsonb)
                """);
        jdbc.update("""
                INSERT INTO jobs (id, slug, title, short_summary, organization, category, status,
                    location, total_vacancies, salary_or_stipend, qualification_summary,
                    important_dates, important_links)
                VALUES ('integration-draft', 'integration-draft-role', 'Unpublished Integration Draft',
                    'Must not be public', 'Integration Organization', 'government', 'CLOSED',
                    'All India', '1', 'As per rules', 'Graduate',
                    '{}'::jsonb, '[]'::jsonb)
                """);

        var result = jobs.search(0, 10, "Integration", null, null, null, null, "createdAt", "desc");

        assertThat(result.getContent()).extracting(item -> item.slug())
                .contains("integration-open-role")
                .doesNotContain("integration-draft-role");
        assertThat(jobRepository.findBySlugAndStatusNotIgnoreCase("integration-draft-role", "CLOSED")).isEmpty();
    }

    @Test
    void servesExistingOrganizationProfilesAndOnlyPublicOrganizationJobs() {
        jdbc.update("""
                INSERT INTO organizations (id, name, short_name, slug, category_type, is_active)
                VALUES ('integration-org', 'Integration Recruitment Board', 'IRB',
                    'integration-recruitment-board', 'Public Commission', true)
                """);
        jdbc.update("""
                INSERT INTO jobs (id, slug, title, short_summary, organization, category, status,
                    location, total_vacancies, salary_or_stipend, qualification_summary,
                    important_dates, important_links)
                VALUES ('integration-org-job', 'integration-org-job-role', 'IRB Officer Role',
                    'Integration organization vacancy', 'IRB', 'government', 'OPEN',
                    'All India', '1', 'As per rules', 'Graduate',
                    '{}'::jsonb, '[]'::jsonb)
                """);
        jdbc.update("""
                INSERT INTO jobs (id, slug, title, short_summary, organization, category, status,
                    location, total_vacancies, salary_or_stipend, qualification_summary,
                    important_dates, important_links)
                VALUES ('integration-org-draft', 'integration-org-draft-role', 'IRB Draft Role',
                    'Unpublished organization vacancy', 'Integration Recruitment Board', 'government', 'CLOSED',
                    'All India', '1', 'As per rules', 'Graduate',
                    '{}'::jsonb, '[]'::jsonb)
                """);

        ResponseEntity<OrganizationResponse[]> directory = http.getForEntity(
                url("/api/v1/organizations"), OrganizationResponse[].class);
        assertThat(directory.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(directory.getBody()).extracting(OrganizationResponse::slug)
                .contains("integration-recruitment-board");

        ResponseEntity<OrganizationResponse> profile = http.getForEntity(
                url("/api/v1/organizations/IRB"), OrganizationResponse.class);
        assertThat(profile.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(profile.getBody().stats().totalPostsCount()).isEqualTo(1);
        assertThat(profile.getBody().stats().activeVacanciesCount()).isEqualTo(1);

        ResponseEntity<com.fasterxml.jackson.databind.JsonNode> organizationJobs = http.getForEntity(
                url("/api/v1/organizations/integration-recruitment-board/jobs?page=0&size=12"),
                com.fasterxml.jackson.databind.JsonNode.class);
        assertThat(organizationJobs.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(organizationJobs.getBody().path("content")).hasSize(1);
        assertThat(organizationJobs.getBody().path("content").get(0).path("slug").asText())
                .isEqualTo("integration-org-job-role");
    }

    @Test
    void persistsRateLimitsAndRotatesAndRevokesAuthenticationSessions() {
        boolean first = jdbc.queryForObject("SELECT 1", Integer.class) == 1;
        assertThat(first).isTrue();
        jdbc.update("""
                INSERT INTO jobs (id, slug, title, short_summary, organization, category, status,
                    location, total_vacancies, salary_or_stipend, qualification_summary,
                    important_dates, important_links)
                VALUES ('integration-saved-job', 'integration-saved-role', 'Saved Integration Role',
                    'Candidate bookmark fixture', 'Integration Organization', 'government', 'OPEN',
                    'All India', '1', 'As per rules', 'Graduate',
                    '{}'::jsonb, '[]'::jsonb)
                """);

        String candidateEmail = "candidate-" + UUID.randomUUID() + "@example.invalid";
        AuthUserResponse registration = http.postForObject(
                url("/api/v1/auth/register"),
                new HttpEntity<>(new RegistrationPayload(
                        "Integration Candidate", candidateEmail, "9876543210", "Secure-Pass1!")),
                AuthUserResponse.class);
        assertThat(registration).isNotNull();
        assertThat(registration.role()).isEqualTo("CANDIDATE");
        verify(emailService).sendVerification(anyString(), anyString());

        ResponseEntity<AuthResponse> login = http.postForEntity(
                url("/api/v1/auth/login"),
                new HttpEntity<>(new LoginPayload(candidateEmail, "Secure-Pass1!")),
                AuthResponse.class);
        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.OK);
        AuthResponse access = login.getBody();
        assertThat(access).isNotNull();
        String refreshCookie = cookie(login.getHeaders(), "nextvacancy_refresh");
        String csrfCookie = cookie(login.getHeaders(), "nextvacancy_csrf");

        HttpHeaders bearerHeaders = new HttpHeaders();
        bearerHeaders.setBearerAuth(access.accessToken());
        ResponseEntity<CurrentPrincipalResponse> me = http.exchange(
                url("/api/v1/auth/me"), HttpMethod.GET, new HttpEntity<>(bearerHeaders),
                CurrentPrincipalResponse.class);
        assertThat(me.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(me.getBody().profile().email()).isEqualTo(candidateEmail);

        ResponseEntity<SavedJobResponse> saved = http.exchange(
                url("/api/v1/candidate/saved-jobs/integration-saved-job"), HttpMethod.PUT,
                new HttpEntity<>(bearerHeaders), SavedJobResponse.class);
        assertThat(saved.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(saved.getBody().job().slug()).isEqualTo("integration-saved-role");
        http.exchange(
                url("/api/v1/candidate/saved-jobs/integration-saved-job"), HttpMethod.PUT,
                new HttpEntity<>(bearerHeaders), SavedJobResponse.class);
        ResponseEntity<SavedJobResponse[]> savedList = http.exchange(
                url("/api/v1/candidate/saved-jobs"), HttpMethod.GET,
                new HttpEntity<>(bearerHeaders), SavedJobResponse[].class);
        assertThat(savedList.getBody()).hasSize(1);
        ResponseEntity<Void> removed = http.exchange(
                url("/api/v1/candidate/saved-jobs/integration-saved-job"), HttpMethod.DELETE,
                new HttpEntity<>(bearerHeaders), Void.class);
        assertThat(removed.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        ResponseEntity<SavedJobResponse[]> emptySavedList = http.exchange(
                url("/api/v1/candidate/saved-jobs"), HttpMethod.GET,
                new HttpEntity<>(bearerHeaders), SavedJobResponse[].class);
        assertThat(emptySavedList.getBody()).isEmpty();

        ResponseEntity<AuthResponse> adminLogin = http.postForEntity(
                url("/api/v1/auth/admin/login"),
                new HttpEntity<>(new AdminLoginPayload("integration-admin", ADMIN_TEST_PASSWORD)),
                AuthResponse.class);
        assertThat(adminLogin.getStatusCode()).isEqualTo(HttpStatus.OK);
        HttpHeaders adminHeaders = new HttpHeaders();
        adminHeaders.setBearerAuth(adminLogin.getBody().accessToken());
        ResponseEntity<String> adminSavedJobs = http.exchange(
                url("/api/v1/candidate/saved-jobs"), HttpMethod.GET,
                new HttpEntity<>(adminHeaders), String.class);
        assertThat(adminSavedJobs.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

        HttpHeaders refreshHeaders = new HttpHeaders();
        refreshHeaders.set(HttpHeaders.COOKIE, refreshCookie + "; " + csrfCookie);
        refreshHeaders.set("X-CSRF-Token", access.csrfToken());
        ResponseEntity<AuthResponse> refresh = http.exchange(
                url("/api/v1/auth/refresh"), HttpMethod.POST, new HttpEntity<>(refreshHeaders), AuthResponse.class);
        assertThat(refresh.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(refresh.getBody().accessToken()).isNotEqualTo(access.accessToken());

        String rotatedRefreshCookie = cookie(refresh.getHeaders(), "nextvacancy_refresh");
        String rotatedCsrfCookie = cookie(refresh.getHeaders(), "nextvacancy_csrf");
        HttpHeaders logoutHeaders = new HttpHeaders();
        logoutHeaders.set(HttpHeaders.COOKIE, rotatedRefreshCookie + "; " + rotatedCsrfCookie);
        logoutHeaders.set("X-CSRF-Token", refresh.getBody().csrfToken());
        logoutHeaders.setBearerAuth(refresh.getBody().accessToken());
        ResponseEntity<Void> logout = http.exchange(
                url("/api/v1/auth/logout"), HttpMethod.POST, new HttpEntity<>(logoutHeaders), Void.class);
        assertThat(logout.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        ResponseEntity<String> unauthenticatedSavedJobs = http.exchange(
                url("/api/v1/candidate/saved-jobs"), HttpMethod.GET, HttpEntity.EMPTY, String.class);
        assertThat(unauthenticatedSavedJobs.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);

        HttpHeaders revokedHeaders = new HttpHeaders();
        revokedHeaders.setBearerAuth(refresh.getBody().accessToken());
        ResponseEntity<String> rejected = http.exchange(
                url("/api/v1/auth/me"), HttpMethod.GET, new HttpEntity<>(revokedHeaders), String.class);
        assertThat(rejected.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void rateLimiterAppliesTheConfiguredWindowAgainstPostgres() {
        String key = "integration-rate-" + UUID.randomUUID();
        assertThat(authRateLimits.allow(key, 2)).isTrue();
        assertThat(authRateLimits.allow(key, 2)).isTrue();
        assertThat(authRateLimits.allow(key, 2)).isFalse();
    }

    private String url(String path) {
        return "http://127.0.0.1:" + port + path;
    }

    private static String cookie(HttpHeaders headers, String name) {
        return headers.getOrEmpty(HttpHeaders.SET_COOKIE).stream()
                .filter(value -> value.startsWith(name + "="))
                .map(value -> value.substring(0, value.indexOf(';')))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Expected " + name + " cookie."));
    }

    private record RegistrationPayload(String fullName, String email, String mobile, String password) {
    }

    private record LoginPayload(String email, String password) {
    }

    private record AdminLoginPayload(String identifier, String password) {
    }
}

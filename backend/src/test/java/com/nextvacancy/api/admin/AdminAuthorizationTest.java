package com.nextvacancy.api.admin;

import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.nextvacancy.api.auth.AuthSessionRepository;
import com.nextvacancy.api.auth.AuthTokenService;
import com.nextvacancy.api.auth.JwtPrincipal;
import com.nextvacancy.api.config.SecurityConfiguration;
import com.nextvacancy.api.security.JwtAuthenticationFilter;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.List;

@WebMvcTest(AdminController.class)
@Import({SecurityConfiguration.class, JwtAuthenticationFilter.class})
@TestPropertySource(properties = "app.cors.allowed-origins=https://nextvacancy.com")
class AdminAuthorizationTest {
    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private AdminService adminService;

    @MockitoBean
    private AuthTokenService tokens;

    @MockitoBean
    private AuthSessionRepository sessions;

    @Test
    void unauthenticatedRequestIsUnauthorized() throws Exception {
        mvc.perform(post("/api/v1/admin/jobs").contentType("application/json").content(jobRequest()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "CANDIDATE")
    void candidateRequestIsForbidden() throws Exception {
        mvc.perform(post("/api/v1/admin/jobs").contentType("application/json").content(jobRequest()))
                .andExpect(status().isForbidden());
    }

    @Test
    void malformedBearerTokenIsUnauthorized() throws Exception {
        given(tokens.parseAccessToken("not.a.jwt"))
                .willThrow(new MalformedJwtException("Malformed access token."));

        mvc.perform(get("/api/v1/admin/dashboard").header("Authorization", "Bearer not.a.jwt"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void expiredBearerTokenIsUnauthorized() throws Exception {
        given(tokens.parseAccessToken("expired.jwt"))
                .willThrow(new ExpiredJwtException(null, null, "Expired access token."));

        mvc.perform(get("/api/v1/admin/dashboard").header("Authorization", "Bearer expired.jwt"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void administratorRequestIsAllowed() throws Exception {
        given(adminService.dashboard())
                .willReturn(new AdminDashboardResponse(0, 0, 0, 0, 0, 0));

        mvc.perform(get("/api/v1/admin/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    void administratorCanCallMutationEndpoint() throws Exception {
        given(adminService.createJob(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.eq("root")))
                .willReturn(null);

        mvc.perform(post("/api/v1/admin/jobs")
                        .with(adminAuthentication())
                        .contentType("application/json")
                        .content(jobRequest()))
                .andExpect(status().isCreated());
    }

    private static RequestPostProcessor adminAuthentication() {
        var principal = new JwtPrincipal("admin:root", "session-id", "ADMIN");
        var authToken = new UsernamePasswordAuthenticationToken(
                principal, null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        return authentication(authToken);
    }

    private static String jobRequest() {
        return """
                {
                  "title":"Example recruitment",
                  "shortSummary":"Recruitment notice summary",
                  "organization":"Example Commission",
                  "category":"government",
                  "status":"OPEN",
                  "location":"Delhi",
                  "totalVacancies":"1",
                  "salaryOrStipend":"As per notice",
                  "qualificationSummary":"Graduate",
                  "importantDates":{},
                  "importantLinks":[{"label":"Official notice","url":"https://commission.gov.in"}]
                }
                """;
    }
}

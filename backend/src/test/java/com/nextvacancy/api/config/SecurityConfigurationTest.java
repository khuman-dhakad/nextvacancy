package com.nextvacancy.api.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;

class SecurityConfigurationTest {
    private final SecurityConfiguration configuration = new SecurityConfiguration(null, new ObjectMapper());

    @Test
    void acceptsExplicitHttpsFrontendOrigins() {
        var source = configuration.corsConfigurationSource("https://frontend.example.org", "production");
        CorsConfiguration cors = source.getCorsConfiguration(
                new MockHttpServletRequest("GET", "/api/v1/jobs"));

        assertThat(cors).isNotNull();
        assertThat(cors.getAllowedOrigins()).containsExactly("https://frontend.example.org");
        assertThat(cors.getAllowedMethods()).contains("GET", "POST", "OPTIONS");
    }

    @Test
    void permitsLocalOriginsOnlyOutsideProduction() {
        var localSource = configuration.corsConfigurationSource("http://localhost:5173", "development");
        assertThat(localSource.getCorsConfiguration(new MockHttpServletRequest("GET", "/api/v1/jobs"))
                .getAllowedOrigins()).containsExactly("http://localhost:5173");
        assertThatThrownBy(() -> configuration.corsConfigurationSource("http://localhost:5173", "production"))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> configuration.corsConfigurationSource("*", "development"))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void rejectsOriginsContainingPaths() {
        assertThatThrownBy(() -> configuration.corsConfigurationSource(
                "https://frontend.example.org/app", "production"))
                .isInstanceOf(IllegalStateException.class);
    }
}

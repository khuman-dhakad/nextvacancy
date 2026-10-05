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
        var source = configuration.corsConfigurationSource("https://frontend.example.org");
        CorsConfiguration cors = source.getCorsConfiguration(
                new MockHttpServletRequest("GET", "/api/v1/jobs"));

        assertThat(cors).isNotNull();
        assertThat(cors.getAllowedOrigins()).containsExactly("https://frontend.example.org");
        assertThat(cors.getAllowedMethods()).contains("GET", "POST", "OPTIONS");
    }

    @Test
    void rejectsLocalAndWildcardOrigins() {
        assertThatThrownBy(() -> configuration.corsConfigurationSource("http://localhost:5173"))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> configuration.corsConfigurationSource("*"))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void rejectsOriginsContainingPaths() {
        assertThatThrownBy(() -> configuration.corsConfigurationSource("https://frontend.example.org/app"))
                .isInstanceOf(IllegalStateException.class);
    }
}

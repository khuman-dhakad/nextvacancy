package com.nextvacancy.api.auth;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class AuthRequestSizeLimitFilterTest {
    private final AuthRequestSizeLimitFilter filter = new AuthRequestSizeLimitFilter();

    @Test
    void rejectsAuthRequestBodiesLargerThanFiveMegabytes() throws ServletException, IOException {
        MockHttpServletRequest request = authPostRequest(new byte[AuthRequestSizeLimitFilter.MAX_BODY_SIZE_BYTES + 1]);
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, (wrappedRequest, wrappedResponse) -> {
            throw new AssertionError("Oversized requests must not reach the controller.");
        });

        assertThat(response.getStatus()).isEqualTo(413);
        assertThat(response.getContentType()).startsWith("application/json");
        assertThat(response.getContentAsString()).contains("5 MB limit");
    }

    @Test
    void passesAnAuthRequestWithinTheLimitWithItsBodyIntact() throws ServletException, IOException {
        byte[] body = "{\"email\":\"candidate@example.com\"}".getBytes(StandardCharsets.UTF_8);
        MockHttpServletRequest request = authPostRequest(body);
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, (wrappedRequest, wrappedResponse) ->
                assertThat(wrappedRequest.getInputStream().readAllBytes()).isEqualTo(body));

        assertThat(response.getStatus()).isEqualTo(200);
    }

    private static MockHttpServletRequest authPostRequest(byte[] body) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/auth/register");
        request.setServletPath("/api/v1/auth/register");
        request.setContent(body);
        return request;
    }
}

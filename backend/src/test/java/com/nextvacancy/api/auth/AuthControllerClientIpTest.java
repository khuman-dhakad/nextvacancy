package com.nextvacancy.api.auth;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class AuthControllerClientIpTest {

    @Test
    void clientIpUsesRemoteAddrDirectlyAndIgnoresUntrustedHeaders() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("203.0.113.195");
        request.addHeader("X-Real-IP", "198.51.100.99");
        request.addHeader("X-Forwarded-For", "198.51.100.99, 10.0.0.1");

        // AuthController.clientIp must strictly return request.getRemoteAddr()
        // and ignore spoofable client-supplied headers like X-Real-IP.
        assertThat(AuthController.clientIp(request)).isEqualTo("203.0.113.195");
    }
}

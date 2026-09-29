package com.nextvacancy.api.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

public class AuthCsrfFilter extends OncePerRequestFilter {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        boolean cookieMutation = "POST".equals(request.getMethod())
                && (path.equals("/api/v1/auth/refresh") || path.equals("/api/v1/auth/logout"));
        if (!cookieMutation) {
            chain.doFilter(request, response);
            return;
        }

        String cookieToken = cookieValue(request.getCookies(), "nextvacancy_csrf");
        String headerToken = request.getHeader("X-CSRF-Token");
        if (cookieToken == null || headerToken == null
                || !MessageDigest.isEqual(cookieToken.getBytes(StandardCharsets.UTF_8),
                        headerToken.getBytes(StandardCharsets.UTF_8))) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getOutputStream(), Map.of("error", "CSRF validation failed."));
            return;
        }
        chain.doFilter(request, response);
    }

    private static String cookieValue(Cookie[] cookies, String name) {
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) return cookie.getValue();
        }
        return null;
    }
}

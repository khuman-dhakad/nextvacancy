package com.nextvacancy.api.auth;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

public final class AuthRequestSizeLimitFilter extends OncePerRequestFilter {
    static final int MAX_BODY_SIZE_BYTES = 5 * 1024 * 1024;
    private static final String ERROR_RESPONSE = "{\"error\":\"Request body exceeds the 5 MB limit.\"}";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            jakarta.servlet.FilterChain filterChain) throws ServletException, IOException {
        if (!isAuthRequestWithBody(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (request.getContentLengthLong() > MAX_BODY_SIZE_BYTES) {
            rejectOversizedRequest(response);
            return;
        }

        byte[] requestBody = request.getInputStream().readNBytes(MAX_BODY_SIZE_BYTES + 1);
        if (requestBody.length > MAX_BODY_SIZE_BYTES) {
            rejectOversizedRequest(response);
            return;
        }

        filterChain.doFilter(new CachedBodyRequest(request, requestBody), response);
    }

    private static boolean isAuthRequestWithBody(HttpServletRequest request) {
        String path = request.getServletPath();
        String method = request.getMethod();
        return path.startsWith("/api/v1/auth/")
                && ("POST".equals(method) || "PUT".equals(method) || "PATCH".equals(method));
    }

    private static void rejectOversizedRequest(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(ERROR_RESPONSE);
    }

    private static final class CachedBodyRequest extends HttpServletRequestWrapper {
        private final byte[] body;

        private CachedBodyRequest(HttpServletRequest request, byte[] body) {
            super(request);
            this.body = body;
        }

        @Override
        public ServletInputStream getInputStream() {
            ByteArrayInputStream input = new ByteArrayInputStream(body);
            return new ServletInputStream() {
                @Override
                public int read() {
                    return input.read();
                }

                @Override
                public boolean isFinished() {
                    return input.available() == 0;
                }

                @Override
                public boolean isReady() {
                    return true;
                }

                @Override
                public void setReadListener(ReadListener readListener) {
                    try {
                        if (!isFinished()) readListener.onDataAvailable();
                        if (isFinished()) readListener.onAllDataRead();
                    } catch (IOException exception) {
                        readListener.onError(exception);
                    }
                }
            };
        }

        @Override
        public BufferedReader getReader() throws IOException {
            String encoding = getCharacterEncoding();
            Charset charset = encoding == null ? StandardCharsets.UTF_8 : Charset.forName(encoding);
            return new BufferedReader(new InputStreamReader(getInputStream(), charset));
        }
    }
}

package com.nextvacancy.api.security;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;

import com.nextvacancy.api.auth.AuthSessionRepository;
import com.nextvacancy.api.auth.AuthTokenService;
import com.nextvacancy.api.auth.JwtPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final List<String> ALLOWED_ROLES = List.of("CANDIDATE", "ADMIN");

    private final AuthTokenService tokens;
    private final AuthSessionRepository sessions;

    public JwtAuthenticationFilter(AuthTokenService tokens, AuthSessionRepository sessions) {
        this.tokens = tokens;
        this.sessions = sessions;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            String rawToken = authorization.substring(7).trim();
            try {
                Claims claims = tokens.parseAccessToken(rawToken);
                String principalId = claims.getSubject();
                String role = claims.get("role", String.class);
                String sessionId = claims.get("sid", String.class);
                if (principalId != null && !principalId.isBlank() && sessionId != null
                        && ALLOWED_ROLES.contains(role)
                        && sessions.findByIdAndRevokedAtIsNullAndExpiresAtAfter(sessionId, OffsetDateTime.now())
                                .filter(session -> session.getPrincipalId().equals(principalId)
                                        && session.getRole().equals(role))
                                .isPresent()) {
                    JwtPrincipal principal = new JwtPrincipal(principalId, sessionId, role);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(principal, null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + role)));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (JwtException | IllegalArgumentException exception) {
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}

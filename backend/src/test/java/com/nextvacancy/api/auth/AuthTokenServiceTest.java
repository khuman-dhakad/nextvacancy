package com.nextvacancy.api.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

class AuthTokenServiceTest {
    private static final byte[] SECRET_BYTES = new byte[32];
    private static final String SECRET = Base64.getEncoder().encodeToString(SECRET_BYTES);
    private final AuthTokenService tokens = new AuthTokenService(SECRET, "nextvacancy", 900, 86400);

    @Test
    void createsAndValidatesSignedAccessTokens() {
        String jwt = tokens.createAccessToken("candidate-1", "CANDIDATE", "session-1");

        assertThat(tokens.parseAccessToken(jwt).getSubject()).isEqualTo("candidate-1");
        assertThat(tokens.parseAccessToken(jwt).get("role", String.class)).isEqualTo("CANDIDATE");
        assertThat(tokens.parseAccessToken(jwt).get("sid", String.class)).isEqualTo("session-1");
    }

    @Test
    void rejectsMalformedAndTamperedTokens() {
        assertThatThrownBy(() -> tokens.parseAccessToken("not.a.jwt"))
                .isInstanceOf(RuntimeException.class);
        String jwt = tokens.createAccessToken("candidate-1", "CANDIDATE", "session-1");
        String tampered = jwt.substring(0, jwt.length() - 1) + (jwt.endsWith("a") ? "b" : "a");
        assertThatThrownBy(() -> tokens.parseAccessToken(tampered))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void rejectsExpiredTokens() {
        Instant now = Instant.now();
        String expired = Jwts.builder()
                .issuer("nextvacancy")
                .subject("candidate-1")
                .claim("role", "CANDIDATE")
                .claim("sid", "session-1")
                .issuedAt(Date.from(now.minusSeconds(120)))
                .expiration(Date.from(now.minusSeconds(60)))
                .signWith(Keys.hmacShaKeyFor(SECRET_BYTES))
                .compact();

        assertThatThrownBy(() -> tokens.parseAccessToken(expired))
                .isInstanceOf(ExpiredJwtException.class);
    }

    @Test
    void rejectsWeakKeysAndUnsafeLifetimes() {
        assertThatThrownBy(() -> new AuthTokenService(Base64.getEncoder().encodeToString(new byte[16]),
                "nextvacancy", 900, 86400)).isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> new AuthTokenService(SECRET, "nextvacancy", 30, 86400))
                .isInstanceOf(IllegalStateException.class);
    }
}

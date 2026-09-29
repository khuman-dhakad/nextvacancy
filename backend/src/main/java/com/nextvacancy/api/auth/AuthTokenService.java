package com.nextvacancy.api.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

import javax.crypto.SecretKey;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthTokenService {
    private final SecretKey signingKey;
    private final String issuer;
    private final long accessTtlSeconds;
    private final long refreshTtlSeconds;
    private final SecureRandom random = new SecureRandom();

    public AuthTokenService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.issuer}") String issuer,
            @Value("${app.jwt.access-token-ttl}") long accessTtlSeconds,
            @Value("${app.jwt.refresh-token-ttl}") long refreshTtlSeconds) {
        byte[] decoded;
        try {
            decoded = Decoders.BASE64.decode(secret);
        } catch (RuntimeException exception) {
            throw new IllegalStateException("JWT_SECRET must be a base64-encoded key of at least 32 bytes.", exception);
        }
        if (decoded.length < 32 || accessTtlSeconds < 60 || accessTtlSeconds > 3600
                || refreshTtlSeconds < accessTtlSeconds || refreshTtlSeconds > 2_592_000) {
            throw new IllegalStateException("JWT key and token lifetimes do not meet the configured security bounds.");
        }
        this.signingKey = Keys.hmacShaKeyFor(decoded);
        this.issuer = issuer;
        this.accessTtlSeconds = accessTtlSeconds;
        this.refreshTtlSeconds = refreshTtlSeconds;
    }

    public String newSessionId() {
        return UUID.randomUUID().toString();
    }

    public String newRefreshToken() {
        byte[] token = new byte[48];
        random.nextBytes(token);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(token);
    }

    public String hashToken(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }

    public String createAccessToken(String principalId, String role, String sessionId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .issuer(issuer)
                .subject(principalId)
                .claim("role", role)
                .claim("sid", sessionId)
                .issuedAt(java.util.Date.from(now))
                .expiration(java.util.Date.from(now.plusSeconds(accessTtlSeconds)))
                .signWith(signingKey)
                .compact();
    }

    public Claims parseAccessToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getAccessTtlSeconds() { return accessTtlSeconds; }
    public long getRefreshTtlSeconds() { return refreshTtlSeconds; }
}

package com.nextvacancy.api.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthRateLimitService {
    private final JdbcTemplate jdbc;

    public AuthRateLimitService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean allow(String key, int maxAttempts) {
        if (maxAttempts < 1) {
            throw new IllegalArgumentException("maxAttempts must be positive.");
        }
        int count = jdbc.queryForObject("""
                INSERT INTO auth_rate_limits (key_hash, window_started_at, attempts)
                VALUES (?, now(), 1)
                ON CONFLICT (key_hash) DO UPDATE SET
                  window_started_at = CASE
                    WHEN auth_rate_limits.window_started_at <= now() - interval '1 minute' THEN now()
                    ELSE auth_rate_limits.window_started_at
                  END,
                  attempts = CASE
                    WHEN auth_rate_limits.window_started_at <= now() - interval '1 minute' THEN 1
                    ELSE auth_rate_limits.attempts + 1
                  END
                RETURNING attempts
                """, Integer.class, hashKey(key));
        return count <= maxAttempts;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void clear(String key) {
        jdbc.update("DELETE FROM auth_rate_limits WHERE key_hash = ?", hashKey(key));
    }

    @Scheduled(cron = "0 17 * * * *")
    public void removeExpiredWindows() {
        jdbc.update("DELETE FROM auth_rate_limits WHERE window_started_at < now() - interval '10 minutes'");
    }

    private static String hashKey(String key) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(key.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }
}

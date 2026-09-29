package com.nextvacancy.api.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.HexFormat;

import org.bouncycastle.crypto.generators.SCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    private static final int LEGACY_SCRYPT_COST = 1 << 14;
    private static final int LEGACY_SCRYPT_BLOCK_SIZE = 8;
    private static final int LEGACY_SCRYPT_PARALLELIZATION = 1;
    private static final int LEGACY_KEY_LENGTH = 64;
    private static final int BCRYPT_STRENGTH = 12;
    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder(BCRYPT_STRENGTH);
    private final SecureRandom random = new SecureRandom();

    public String hash(String password) {
        return bcrypt.encode(password);
    }

    public boolean matches(String password, String encoded) {
        if (encoded == null) {
            return false;
        }
        if (encoded.startsWith("$2a$") || encoded.startsWith("$2b$") || encoded.startsWith("$2y$")) {
            return bcrypt.matches(password, encoded);
        }

        String[] parts = encoded.split("\\$", -1);
        if (parts.length != 3 || !"scrypt".equals(parts[0])
                || !parts[1].matches("(?i)[0-9a-f]{32}")
                || !parts[2].matches("(?i)[0-9a-f]{128}")) {
            return false;
        }
        byte[] salt = HexFormat.of().parseHex(parts[1]);
        byte[] expected = HexFormat.of().parseHex(parts[2]);
        byte[] actual = SCrypt.generate(password.getBytes(StandardCharsets.UTF_8), salt,
                LEGACY_SCRYPT_COST, LEGACY_SCRYPT_BLOCK_SIZE, LEGACY_SCRYPT_PARALLELIZATION, expected.length);
        return MessageDigest.isEqual(expected, actual);
    }

    public boolean needsUpgrade(String encoded) {
        return encoded != null && encoded.startsWith("scrypt$");
    }
}

package com.nextvacancy.api.auth;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PasswordServiceTest {
    private final PasswordService passwords = new PasswordService();

    @Test
    void hashesNewPasswordsWithBcrypt() {
        String encoded = passwords.hash("Secure-Pass1");

        assertThat(encoded).startsWith("$2");
        assertThat(passwords.matches("Secure-Pass1", encoded)).isTrue();
        assertThat(passwords.matches("Wrong-Pass1", encoded)).isFalse();
    }

    @Test
    void verifiesNodeScryptHashesForExistingAccounts() {
        String legacyHash = "scrypt$000102030405060708090a0b0c0d0e0f$"
                + "99caafcdb2024f058945079e4afe68ab058ee419861162d9e8af9b9b92a3c1bd"
                + "c03afade4aa311d6be93cd890a8a87462df34543495e7a912c6a33d6046c7601";

        assertThat(passwords.matches("NextVacancy-test-password", legacyHash)).isTrue();
        assertThat(passwords.matches("incorrect-password", legacyHash)).isFalse();
        assertThat(passwords.needsUpgrade(legacyHash)).isTrue();
    }

    @Test
    void rejectsMalformedOrUnsupportedHashes() {
        assertThat(passwords.matches("password", "scrypt$bad$hash")).isFalse();
        assertThat(passwords.matches("password", "sha256$abc$def")).isFalse();
    }
}

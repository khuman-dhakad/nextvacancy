package com.nextvacancy.api.auth;

public class AccountConflictException extends RuntimeException {
    public AccountConflictException() {
        super("An account with this email address already exists.");
    }
}

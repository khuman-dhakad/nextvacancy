package com.nextvacancy.api.auth;

public class AccountLockedException extends RuntimeException {
    public AccountLockedException() {
        super("Account temporarily locked. Please try again later.");
    }
}

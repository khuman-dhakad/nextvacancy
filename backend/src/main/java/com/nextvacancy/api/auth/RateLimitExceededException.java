package com.nextvacancy.api.auth;

public class RateLimitExceededException extends RuntimeException {
    public RateLimitExceededException() {
        super("Too many attempts. Please try again later.");
    }
}

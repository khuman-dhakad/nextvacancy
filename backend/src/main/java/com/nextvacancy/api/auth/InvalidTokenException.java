package com.nextvacancy.api.auth;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException() {
        super("The link is invalid, expired, or already used.");
    }
}

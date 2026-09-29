package com.nextvacancy.api.auth;

public class EmailDeliveryException extends RuntimeException {
    public EmailDeliveryException() {
        super("Transactional email delivery is temporarily unavailable.");
    }
}

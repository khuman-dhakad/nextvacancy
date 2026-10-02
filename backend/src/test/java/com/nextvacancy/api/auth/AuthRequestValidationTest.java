package com.nextvacancy.api.auth;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Test;

class AuthRequestValidationTest {
    @Test
    void registrationRequiresValidEmailIndianMobileAndStrongPassword() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();

            var violations = validator.validate(new RegistrationRequest(
                    "Candidate Example", "not-an-email", "1234567890", "lowercase1"));

            assertThat(violations)
                    .extracting(violation -> violation.getPropertyPath().toString())
                    .contains("email", "mobile", "password");
        }
    }

    @Test
    void acceptsAValidRegistrationRequest() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();

            var violations = validator.validate(new RegistrationRequest(
                    "Candidate Example", "candidate@example.com", "9876543210", "StrongPass1"));

            assertThat(violations).isEmpty();
        }
    }

    @Test
    void passwordResetRequiresAStrongPassword() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();

            var violations = validator.validate(new PasswordResetCompletionRequest("reset-token", "weakpass"));

            assertThat(violations)
                    .extracting(violation -> violation.getPropertyPath().toString())
                    .contains("password");
        }
    }
}

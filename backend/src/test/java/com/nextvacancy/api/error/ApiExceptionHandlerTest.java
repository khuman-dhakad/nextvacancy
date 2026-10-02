package com.nextvacancy.api.error;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import com.nextvacancy.api.auth.AuthController;
import com.nextvacancy.api.auth.RegistrationRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

class ApiExceptionHandlerTest {
    @Test
    void returnsFieldSpecificValidationErrorsWithoutInputValues() throws NoSuchMethodException {
        var registrationRequest = new RegistrationRequest(
                "Candidate Example", "invalid", "123", "weak");
        var bindingResult = new BeanPropertyBindingResult(registrationRequest, "registrationRequest");
        bindingResult.addError(new FieldError("registrationRequest", "email", "Enter a valid email address."));
        MethodParameter requestParameter = new MethodParameter(
                AuthController.class.getMethod("register", RegistrationRequest.class, HttpServletRequest.class), 0);
        var exception = new MethodArgumentNotValidException(requestParameter, bindingResult);

        var response = new ApiExceptionHandler().handleInvalidBody(exception);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody()).containsEntry("error", "Request validation failed.");
        assertThat(response.getBody()).containsEntry(
                "fieldErrors", Map.of("email", "Enter a valid email address."));
    }
}

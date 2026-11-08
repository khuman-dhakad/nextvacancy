package com.nextvacancy.api.admin;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class JobUrlValidationTest {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static Validator validator;

    @BeforeAll
    static void initValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void acceptsValidHttpAndHttpsUrls() {
        assertThat(JobWriteRequest.isValidHttpUrl("https://example.com/apply")).isTrue();
        assertThat(JobWriteRequest.isValidHttpUrl("http://upsc.gov.in/notifications")).isTrue();
        assertThat(JobWriteRequest.isValidHttpUrl("https://ssc.nic.in/exam?id=123#page")).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "javascript:alert(1)",
            "data:text/html,<script>alert(1)</script>",
            "vbscript:msgbox(1)",
            "file:///etc/passwd",
            "//protocol-relative.com",
            "/relative/path",
            "not a url",
            ""
    })
    void rejectsDangerousOrMalformedUrls(String dangerousUrl) {
        assertThat(JobWriteRequest.isValidHttpUrl(dangerousUrl)).isFalse();
    }

    @Test
    void rejectsUrlExceedingMaxLength() {
        String longUrl = "https://example.com/" + "a".repeat(2040);
        assertThat(longUrl.length()).isGreaterThan(2048);
        assertThat(JobWriteRequest.isValidHttpUrl(longUrl)).isFalse();
    }

    @Test
    void extractsUrlFromVariousJsonFormats() {
        assertThat(JobWriteRequest.extractUrl(mapper.valueToTree("https://example.com/direct")))
                .isEqualTo("https://example.com/direct");

        ObjectNode objWithUrl = mapper.createObjectNode().put("url", "https://example.com/obj");
        assertThat(JobWriteRequest.extractUrl(objWithUrl)).isEqualTo("https://example.com/obj");

        ObjectNode objWithLink = mapper.createObjectNode().put("link", "https://example.com/link");
        assertThat(JobWriteRequest.extractUrl(objWithLink)).isEqualTo("https://example.com/link");

        ObjectNode objWithHref = mapper.createObjectNode().put("href", "https://example.com/href");
        assertThat(JobWriteRequest.extractUrl(objWithHref)).isEqualTo("https://example.com/href");
    }

    @Test
    void validatesJobWriteRequestWithBeanValidation() {
        ArrayNode links = mapper.createArrayNode();
        links.addObject().put("title", "Apply Online").put("url", "javascript:stealToken()");

        JobWriteRequest request = new JobWriteRequest(
                "Software Engineer",
                "software-engineer",
                "Summary",
                "Tech Corp",
                "https://example.com/logo.png",
                "Engineering",
                "technology",
                "ACTIVE",
                "Bangalore",
                "10",
                "10-15 LPA",
                "Full Time",
                "Online",
                "B.Tech",
                null,
                mapper.createObjectNode(),
                null,
                null,
                null,
                null,
                null,
                null,
                links,
                null,
                false,
                false,
                true);

        Set<ConstraintViolation<JobWriteRequest>> violations = validator.validate(request);
        assertThat(violations).isNotEmpty();
        assertThat(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("validImportantLinks")))
                .isTrue();
    }
}

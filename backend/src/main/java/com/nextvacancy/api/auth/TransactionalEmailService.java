package com.nextvacancy.api.auth;

import java.net.URI;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class TransactionalEmailService {
    private static final Logger log = LoggerFactory.getLogger(TransactionalEmailService.class);
    private final RestClient client;
    private final String apiKey;
    private final String sender;
    private final URI publicUrl;

    public TransactionalEmailService(
            @Value("${app.email.api-key}") String apiKey,
            @Value("${app.email.from}") String sender,
            @Value("${app.public-url}") String publicUrl,
            @Value("${app.environment:development}") String environment) {
        if (apiKey.isBlank() || sender.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY and RESEND_FROM_EMAIL are required.");
        }
        this.publicUrl = validatePublicUrl(publicUrl, "production".equalsIgnoreCase(environment));
        this.apiKey = apiKey;
        this.sender = sender;
        this.client = RestClient.builder().baseUrl("https://api.resend.com").build();
    }

    public void sendVerification(String recipient, String token) {
        URI link = UriComponentsBuilder.fromUri(publicUrl).path("/verify-email")
                .queryParam("token", token).build().encode().toUri();
        send(recipient, "Verify your NEXTVACANCY email",
                "<p>Confirm your email address:</p><p><a href=\"" + link + "\">Verify email</a></p>");
    }

    public void sendPasswordReset(String recipient, String token) {
        URI link = UriComponentsBuilder.fromUri(publicUrl).path("/reset-password")
                .queryParam("token", token).build().encode().toUri();
        send(recipient, "Reset your NEXTVACANCY password",
                "<p>Use this secure link to reset your password:</p><p><a href=\"" + link
                        + "\">Reset password</a></p>");
    }

    private void send(String recipient, String subject, String html) {
        try {
            client.post()
                    .uri("/emails")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + apiKey)
                    .body(new EmailPayload(sender, recipient, subject, html))
                    .retrieve()
                    .toBodilessEntity();
        } catch (RuntimeException exception) {
            log.error("Transactional email delivery failed (type={}).", exception.getClass().getSimpleName());
            throw new EmailDeliveryException();
        }
    }

    private static URI validatePublicUrl(String value, boolean production) {
        try {
            URI uri = URI.create(value);
            String host = uri.getHost();
            boolean localhost = host != null && (host.equalsIgnoreCase("localhost")
                    || host.startsWith("127.") || host.equals("0.0.0.0") || host.equals("::1")
                    || host.endsWith(".localhost"));
            boolean placeholder = host != null && (host.endsWith(".invalid") || host.endsWith(".test")
                    || host.endsWith(".example") || host.endsWith(".example.com"));
            boolean localDevelopmentUrl = !production && "http".equalsIgnoreCase(uri.getScheme())
                    && localhost;
            if (!(("https".equalsIgnoreCase(uri.getScheme()) && !localhost && !placeholder)
                    || localDevelopmentUrl)
                    || host == null || uri.getRawUserInfo() != null
                    || (uri.getRawPath() != null && !uri.getRawPath().isEmpty() && !"/".equals(uri.getRawPath()))
                    || uri.getRawQuery() != null || uri.getRawFragment() != null) {
                throw new IllegalStateException("APP_PUBLIC_URL must be a public HTTPS origin or local development origin.");
            }
            return uri;
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException("APP_PUBLIC_URL must be a public HTTPS origin or local development origin.", exception);
        }
    }

    private record EmailPayload(String from, String to, String subject, String html) {
    }
}

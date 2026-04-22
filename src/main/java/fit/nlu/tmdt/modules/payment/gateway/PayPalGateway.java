package fit.nlu.tmdt.modules.payment.gateway;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Locale;
import java.util.Map;

/**
 * PayPal Checkout gateway integration.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PayPalGateway {

    private final ObjectMapper objectMapper;

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    @Value("${paypal.base-url}")
    private String baseUrl;

    @Value("${paypal.return-url}")
    private String returnUrl;

    @Value("${paypal.cancel-url}")
    private String cancelUrl;

    @Value("${paypal.currency:USD}")
    private String currency;

    public PayPalOrderResponse createOrder(String orderId, Double amount, String description) {
        try {
            RestClient client = RestClient.builder()
                    .baseUrl(baseUrl)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build();

            String accessToken = fetchAccessToken(client);

            Map<String, Object> payload = Map.of(
                    "intent", "CAPTURE",
                    "purchase_units", new Object[]{
                            Map.of(
                                    "reference_id", orderId,
                                    "description", description,
                                    "amount", Map.of(
                                            "currency_code", currency,
                                            "value", formatAmount(amount)
                                    )
                            )
                    },
                    "payment_source", Map.of(
                            "paypal", Map.of(
                                    "experience_context", Map.of(
                                            "payment_method_preference", "IMMEDIATE_PAYMENT_REQUIRED",
                                            "user_action", "PAY_NOW",
                                            "return_url", returnUrl,
                                            "cancel_url", cancelUrl
                                    )
                            )
                    )
            );

            String responseBody = client.post()
                    .uri("/v2/checkout/orders")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(responseBody);
            return PayPalOrderResponse.builder()
                    .paypalOrderId(root.path("id").asText(null))
                    .status(root.path("status").asText(null))
                    .approvalUrl(extractLink(root, "approve"))
                    .build();
        } catch (BusinessException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Failed to create PayPal order: {}", exception.getMessage(), exception);
            throw new BusinessException(ErrorCode.PAY_001.getCode(), "Unable to create PayPal order");
        }
    }

    public PayPalCaptureResponse captureOrder(String paypalOrderId) {
        try {
            RestClient client = RestClient.builder()
                    .baseUrl(baseUrl)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build();

            String accessToken = fetchAccessToken(client);

            String responseBody = client.post()
                    .uri("/v2/checkout/orders/{orderId}/capture", paypalOrderId)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode purchaseUnit = root.path("purchase_units").path(0);
            JsonNode capture = purchaseUnit.path("payments").path("captures").path(0);
            JsonNode payer = root.path("payer");

            return PayPalCaptureResponse.builder()
                    .paypalOrderId(root.path("id").asText(paypalOrderId))
                    .status(root.path("status").asText(null))
                    .captureId(capture.path("id").asText(null))
                    .payerId(payer.path("payer_id").asText(null))
                    .payerEmail(payer.path("email_address").asText(null))
                    .currency(capture.path("amount").path("currency_code").asText(currency))
                    .amount(parseAmount(capture.path("amount").path("value").asText("0")))
                    .responseCode(capture.path("status").asText(root.path("status").asText("UNKNOWN")))
                    .responseMessage(capture.path("seller_protection").path("status").asText("COMPLETED"))
                    .build();
        } catch (BusinessException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Failed to capture PayPal order {}: {}", paypalOrderId, exception.getMessage(), exception);
            throw new BusinessException(ErrorCode.PAY_005.getCode(), "Unable to capture PayPal payment");
        }
    }

    private String fetchAccessToken(RestClient client) throws Exception {
        String responseBody = client.post()
                .uri("/v1/oauth2/token")
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodeCredentials())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body("grant_type=client_credentials")
                .retrieve()
                .body(String.class);

        JsonNode root = objectMapper.readTree(responseBody);
        String accessToken = root.path("access_token").asText();
        if (accessToken == null || accessToken.isBlank()) {
            throw new BusinessException(ErrorCode.PAY_005.getCode(), "PayPal access token is missing");
        }
        return accessToken;
    }

    private String extractLink(JsonNode root, String rel) {
        for (JsonNode link : root.path("links")) {
            if (rel.equalsIgnoreCase(link.path("rel").asText())) {
                return link.path("href").asText(null);
            }
        }
        return null;
    }

    private String encodeCredentials() {
        String raw = clientId + ":" + clientSecret;
        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    private String formatAmount(Double amount) {
        return String.format(Locale.US, "%.2f", amount);
    }

    private Double parseAmount(String value) {
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException exception) {
            return 0.0;
        }
    }

    @lombok.Builder
    @lombok.Getter
    public static class PayPalOrderResponse {
        private final String paypalOrderId;
        private final String status;
        private final String approvalUrl;
    }

    @lombok.Builder
    @lombok.Getter
    public static class PayPalCaptureResponse {
        private final String paypalOrderId;
        private final String status;
        private final String captureId;
        private final String payerId;
        private final String payerEmail;
        private final Double amount;
        private final String currency;
        private final String responseCode;
        private final String responseMessage;
    }
}

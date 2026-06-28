package fit.nlu.tmdt.modules.payment.gateway;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Pattern;

/**
 * VNPay Payment Gateway
 * Handles VNPay API integration for payment URL generation and IPN verification
 */
@Component
@Slf4j
public class VNPayGateway {

    private static final String VNP_VERSION = "2.1.0";
    private static final String VNP_COMMAND_PAY = "pay";
    private static final String VNP_CURRENCY = "VND";
    private static final String VNP_LOCALE = "vn";
    private static final DateTimeFormatter VNP_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String hashSecret;

    @Value("${vnpay.url}")
    private String vnpayUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    @Value("${vnpay.ipn-url}")
    private String ipnUrl;

    public String buildPaymentUrl(String orderId, Double amount, String orderInfo, String bankCode, String ipAddr) {
        Map<String, String> params = new TreeMap<>();

        params.put("vnp_Version", VNP_VERSION);
        params.put("vnp_Command", VNP_COMMAND_PAY);
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", String.valueOf((long) (amount * 100)));
        params.put("vnp_CurrCode", VNP_CURRENCY);
        params.put("vnp_TxnRef", orderId);
        params.put("vnp_OrderInfo", removeAccents(orderInfo));
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", VNP_LOCALE);
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", ipAddr != null ? ipAddr : "127.0.0.1");
        java.time.ZoneId vnZone = java.time.ZoneId.of("Asia/Ho_Chi_Minh");
        params.put("vnp_CreateDate", LocalDateTime.now(vnZone).format(VNP_DATE_FORMATTER));
        params.put("vnp_ExpireDate", LocalDateTime.now(vnZone).plusMinutes(15).format(VNP_DATE_FORMATTER));

        if (bankCode != null && !bankCode.isBlank()) {
            params.put("vnp_BankCode", bankCode);
        }

        String hashData = buildHashData(params);
        log.info("VNPay buildPaymentUrl hashData (raw): {}", hashData);
        String secureHash = hmacSHA512(hashSecret, hashData);

        String queryString = buildQueryString(params);
        String paymentEndpoint = vnpayUrl.endsWith("/paymentv2/vpcpay.html")
                ? vnpayUrl
                : vnpayUrl + "/paymentv2/vpcpay.html";

        String finalUrl = paymentEndpoint + "?" + queryString + "&vnp_SecureHash=" + secureHash;
        log.info("Generated VNPay payment URL: {}", finalUrl);
        return finalUrl;
    }

    public boolean verifySignature(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null || receivedHash.isBlank()) {
            log.warn("VNPay signature verification failed: received hash is empty");
            return false;
        }

        Map<String, String> filteredParams = new TreeMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (!entry.getKey().equals("vnp_SecureHash") && !entry.getKey().equals("vnp_SecureHashType")) {
                filteredParams.put(entry.getKey(), entry.getValue());
            }
        }

        String hashData = buildHashData(filteredParams);
        log.info("VNPay verifySignature hashData (raw): {}", hashData);
        String computedHash = hmacSHA512(hashSecret, hashData);
        boolean result = computedHash.equalsIgnoreCase(receivedHash);
        if (!result) {
            log.error("VNPay signature mismatch! Computed: {}, Received: {}", computedHash, receivedHash);
        } else {
            log.info("VNPay signature verified successfully");
        }
        return result;
    }

    public Map<String, String> extractParams(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String name = paramNames.nextElement();
            params.put(name, request.getParameter(name));
        }
        return params;
    }

    public boolean isSuccess(Map<String, String> params) {
        return "00".equals(params.get("vnp_ResponseCode"))
                && "00".equals(params.get("vnp_TransactionStatus"));
    }

    public String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        if (ip == null || ip.contains(":")) {
            return "127.0.0.1";
        }
        return ip;
    }

    private String buildHashData(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String value = entry.getValue();
            if (value == null || value.isEmpty()) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append("&");
            }
            sb.append(entry.getKey());
            sb.append("=");
            sb.append(value);
        }
        return sb.toString();
    }

    private String buildQueryString(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String value = entry.getValue();
            if (value == null || value.isEmpty()) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append("&");
            }
            sb.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
            sb.append("=");
            sb.append(URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20"));
        }
        return sb.toString();
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.error("Error computing HMAC-SHA512: {}", e.getMessage());
            throw new RuntimeException("Error computing payment signature", e);
        }
    }

    private String removeAccents(String src) {
        if (src == null) {
            return null;
        }
        String temp = Normalizer.normalize(src, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String unsigned = pattern.matcher(temp).replaceAll("")
                .replace("đ", "d")
                .replace("Đ", "D");
        // Keep only letters, digits, spaces, and hyphens/dashes
        return unsigned.replaceAll("[^a-zA-Z0-9\\s\\-]", "");
    }
}

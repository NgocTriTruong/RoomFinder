package fit.nlu.tmdt.modules.payment.gateway;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

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

    public String buildPaymentUrl(String orderId, Double amount, String orderInfo, String bankCode, HttpServletRequest request) {
        Map<String, String> params = new TreeMap<>();

        String ipAddr = getClientIp(request);
        String origin = request.getHeader("Origin");
        if (origin == null || origin.isBlank()) {
            origin = request.getHeader("Referer");
            if (origin != null) {
                try {
                    java.net.URL url = new java.net.URL(origin);
                    origin = url.getProtocol() + "://" + url.getHost() + (url.getPort() != -1 ? ":" + url.getPort() : "");
                } catch (Exception e) {}
            }
        }
        
        String dynamicReturnUrl = returnUrl;
        if (origin != null && !origin.isBlank() && !origin.contains("room-finder-zeta.vercel.app")) {
             // If local frontend, override the return URL
             dynamicReturnUrl = origin + "/payment/vnpay/return";
        }

        params.put("vnp_Version", VNP_VERSION);
        params.put("vnp_Command", VNP_COMMAND_PAY);
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", String.valueOf((long) (amount * 100)));
        params.put("vnp_CurrCode", VNP_CURRENCY);
        params.put("vnp_TxnRef", orderId);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", VNP_LOCALE);
        params.put("vnp_ReturnUrl", dynamicReturnUrl);
        params.put("vnp_IpAddr", ipAddr != null ? ipAddr : "127.0.0.1");
        params.put("vnp_CreateDate", LocalDateTime.now().format(VNP_DATE_FORMATTER));
        params.put("vnp_ExpireDate", LocalDateTime.now().plusMinutes(15).format(VNP_DATE_FORMATTER));

        if (bankCode != null && !bankCode.isBlank()) {
            params.put("vnp_BankCode", bankCode);
        }

        String queryString = buildQueryString(params);
        String secureHash = hmacSHA512(hashSecret, queryString);
        String paymentEndpoint = vnpayUrl.endsWith("/paymentv2/vpcpay.html")
                ? vnpayUrl
                : vnpayUrl + "/paymentv2/vpcpay.html";

        return paymentEndpoint + "?" + queryString + "&vnp_SecureHash=" + secureHash;
    }

    public boolean verifySignature(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null || receivedHash.isBlank()) {
            return false;
        }

        Map<String, String> filteredParams = new TreeMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (!entry.getKey().equals("vnp_SecureHash") && !entry.getKey().equals("vnp_SecureHashType")) {
                filteredParams.put(entry.getKey(), entry.getValue());
            }
        }

        String queryString = buildQueryString(filteredParams);
        String computedHash = hmacSHA512(hashSecret, queryString);
        return computedHash.equalsIgnoreCase(receivedHash);
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
        return ip;
    }

    private String buildQueryString(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (sb.length() > 0) {
                sb.append("&");
            }
            sb.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII));
            sb.append("=");
            sb.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
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
}

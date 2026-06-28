package fit.nlu.tmdt.modules.payment.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class VNPayGatewayTest {

    @Autowired
    private VNPayGateway vnPayGateway;

    @Test
    public void testBuildAndVerifySignature() throws Exception {
        String orderId = "TEST_ORDER_12345";
        Double amount = 100000.0;
        String orderInfo = "Thanh toán gói tiêu chuẩn - RoomFinder";
        String bankCode = "NCB";
        String ipAddr = "127.0.0.1";

        // 1. Build payment URL
        String paymentUrl = vnPayGateway.buildPaymentUrl(orderId, amount, orderInfo, bankCode, ipAddr);
        System.out.println("Generated URL: " + paymentUrl);

        // 2. Parse parameters from the generated URL
        URI uri = new URI(paymentUrl);
        String query = uri.getRawQuery();
        Map<String, String> queryParams = new HashMap<>();
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
            String value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
            queryParams.put(key, value);
        }

        // 3. Verify signature
        boolean isVerified = vnPayGateway.verifySignature(queryParams);
        assertTrue(isVerified, "Signature verification should succeed for generated payment URL parameters");
    }

    @Test
    public void testBuildAndVerifySignatureWithExtraParameters() throws Exception {
        String orderId = "TEST_ORDER_67890";
        Double amount = 250000.0;
        String orderInfo = "Premium Membership Boost";
        String bankCode = "NCB";
        String ipAddr = "192.168.1.100";

        // 1. Build payment URL
        String paymentUrl = vnPayGateway.buildPaymentUrl(orderId, amount, orderInfo, bankCode, ipAddr);

        // 2. Parse parameters from URL
        URI uri = new URI(paymentUrl);
        String query = uri.getRawQuery();
        Map<String, String> queryParams = new HashMap<>();
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
            String value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
            queryParams.put(key, value);
        }

        // Add some extra parameters that might come from client redirects, Spring framework, or filters
        queryParams.put("userId", "123");
        queryParams.put("token", "someRandomToken");
        queryParams.put("action", "callback");

        // 3. Verify signature
        boolean isVerified = vnPayGateway.verifySignature(queryParams);
        assertTrue(isVerified, "Signature verification should succeed even when extra non-VNPay parameters are present");
    }
}

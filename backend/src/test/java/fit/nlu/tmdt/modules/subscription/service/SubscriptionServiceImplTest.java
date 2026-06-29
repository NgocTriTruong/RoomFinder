package fit.nlu.tmdt.modules.subscription.service;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.audit.service.AuditLogService;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.payment.dto.request.CreatePaymentRequest;
import fit.nlu.tmdt.modules.payment.dto.response.PaymentResponse;
import fit.nlu.tmdt.modules.payment.service.PaymentService;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.subscription.dto.request.PurchasePackageRequest;
import fit.nlu.tmdt.modules.subscription.entity.Package;
import fit.nlu.tmdt.modules.subscription.entity.Subscription;
import fit.nlu.tmdt.modules.subscription.entity.enums.PackageType;
import fit.nlu.tmdt.modules.subscription.repository.BoostRepository;
import fit.nlu.tmdt.modules.subscription.repository.PackageRepository;
import fit.nlu.tmdt.modules.subscription.repository.SubscriptionRepository;
import fit.nlu.tmdt.modules.subscription.service.impl.SubscriptionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SubscriptionServiceImplTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private PackageRepository packageRepository;

    @Mock
    private BoostRepository boostRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private SubscriptionServiceImpl subscriptionService;

    @BeforeEach
    public void setup() {
        ReflectionTestUtils.setField(subscriptionService, "autoRenewGraceDays", 3);
        ReflectionTestUtils.setField(subscriptionService, "paymentExpiryMinutes", 30);
    }

    @Test
    public void testInitiatePurchase_cheaperPackage_shouldThrowException() {
        Long userId = 1L;
        Long packageId = 2L;

        User landlord = User.builder()
                .email("landlord@example.com")
                .fullName("Land Lord")
                .build();
        landlord.setId(userId);

        Package activePkg = Package.builder()
                .name("POST_VIP")
                .price(500000.0)
                .type(PackageType.POST_PREMIUM)
                .isActive(true)
                .durationDays(30)
                .maxPosts(50)
                .build();
        activePkg.setId(10L);

        Package cheaperPkg = Package.builder()
                .name("POST_BASIC")
                .price(100000.0)
                .type(PackageType.POST_BASIC)
                .isActive(true)
                .durationDays(30)
                .maxPosts(10)
                .build();
        cheaperPkg.setId(packageId);

        Subscription activeSub = Subscription.builder()
                .landlord(landlord)
                .pkg(activePkg)
                .isActive(true)
                .build();
        activeSub.setId(100L);

        PurchasePackageRequest request = new PurchasePackageRequest();
        request.setPackageId(packageId);
        request.setPaymentMethod("VNPAY");

        when(userRepository.findById(userId)).thenReturn(Optional.of(landlord));
        when(packageRepository.findById(packageId)).thenReturn(Optional.of(cheaperPkg));
        when(subscriptionRepository.findActiveByLandlordId(eq(userId), any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(activeSub));

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            subscriptionService.initiatePurchase(request, userId);
        });

        assertEquals("SUB_007", exception.getErrorCode());
        assertEquals("Không thể mua gói dịch vụ rẻ hơn gói hiện tại đang hoạt động", exception.getMessage());
    }

    @Test
    public void testInitiatePurchase_moreExpensivePackage_shouldSucceed() {
        Long userId = 1L;
        Long packageId = 2L;

        User landlord = User.builder()
                .email("landlord@example.com")
                .fullName("Land Lord")
                .build();
        landlord.setId(userId);

        Package activePkg = Package.builder()
                .name("POST_BASIC")
                .price(100000.0)
                .type(PackageType.POST_BASIC)
                .isActive(true)
                .durationDays(30)
                .maxPosts(10)
                .build();
        activePkg.setId(10L);

        Package expensivePkg = Package.builder()
                .name("POST_VIP")
                .price(500000.0)
                .type(PackageType.POST_PREMIUM)
                .isActive(true)
                .durationDays(30)
                .maxPosts(50)
                .build();
        expensivePkg.setId(packageId);

        Subscription activeSub = Subscription.builder()
                .landlord(landlord)
                .pkg(activePkg)
                .isActive(true)
                .build();
        activeSub.setId(100L);

        PurchasePackageRequest request = new PurchasePackageRequest();
        request.setPackageId(packageId);
        request.setPaymentMethod("VNPAY");

        when(userRepository.findById(userId)).thenReturn(Optional.of(landlord));
        when(packageRepository.findById(packageId)).thenReturn(Optional.of(expensivePkg));
        when(subscriptionRepository.findActiveByLandlordId(eq(userId), any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(activeSub));

        // Mocking payment service call
        PaymentResponse paymentResponse = PaymentResponse.builder()
                .id(999L)
                .orderId("ORDER_123")
                .paymentUrl("http://vnpay.com/payment")
                .build();
        when(paymentService.createOrder(eq(userId), any(CreatePaymentRequest.class)))
                .thenReturn(paymentResponse);

        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Map<String, Object> result = subscriptionService.initiatePurchase(request, userId);
        assertNotNull(result);
        assertEquals("http://vnpay.com/payment", result.get("paymentUrl"));
    }

    @Test
    public void testProcessSuccessfulPayment_shouldCancelOldPostPackage() {
        Long subscriptionId = 200L;
        Long transactionId = 555L;

        User landlord = User.builder()
                .email("landlord@example.com")
                .fullName("Land Lord")
                .build();
        landlord.setId(1L);

        Package oldPkg = Package.builder()
                .name("POST_BASIC")
                .price(100000.0)
                .type(PackageType.POST_BASIC)
                .isActive(true)
                .durationDays(30)
                .maxPosts(10)
                .build();
        oldPkg.setId(10L);

        Package newPkg = Package.builder()
                .name("POST_VIP")
                .price(500000.0)
                .type(PackageType.POST_PREMIUM)
                .isActive(true)
                .durationDays(30)
                .maxPosts(50)
                .build();
        newPkg.setId(11L);

        Subscription oldSub = Subscription.builder()
                .landlord(landlord)
                .pkg(oldPkg)
                .isActive(true)
                .build();
        oldSub.setId(100L);

        Subscription newSub = Subscription.builder()
                .landlord(landlord)
                .pkg(newPkg)
                .isActive(false)
                .build();
        newSub.setId(subscriptionId);

        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(newSub));
        when(subscriptionRepository.findActiveByLandlordId(eq(1L), any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(oldSub));

        subscriptionService.processSuccessfulPayment(subscriptionId, transactionId);

        // Verify old subscription is canceled
        assertFalse(oldSub.getIsActive());
        assertNotNull(oldSub.getCancelledAt());
        assertTrue(oldSub.getCancellationReason().contains("Thay thế bởi gói mới"));

        // Verify new subscription is activated
        assertTrue(newSub.getIsActive());
        assertEquals(transactionId, newSub.getTransactionId());
        assertNotNull(newSub.getStartDate());
        assertNotNull(newSub.getExpiresAt());

        verify(subscriptionRepository, times(2)).save(any(Subscription.class));
    }
}

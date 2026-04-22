package fit.nlu.tmdt.common.resolver;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Argument Resolver cho @CurrentUser annotation
 */
@Component
@Slf4j
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            CurrentUser annotation = parameter.getParameterAnnotation(CurrentUser.class);
            if (annotation != null && !annotation.required()) {
                return null;
            }
            return null;
        }

        Object principal = authentication.getPrincipal();
        
        // 1. Nếu principal là Long (userId) trực tiếp
        if (principal instanceof Long) {
            return principal;
        }

        // 2. Nếu principal là String (ví dụ: "123")
        if (principal instanceof String principalStr) {
            try {
                return Long.parseLong(principalStr);
            } catch (NumberFormatException e) {
                log.debug("Principal is a string but not a Long: {}", principalStr);
            }
        }

        // 3. Thử lấy từ các lớp Principal có method getId() (ví dụ: UserPrincipal, UserDetails...)
        try {
            var getIdMethod = principal.getClass().getMethod("getId");
            return getIdMethod.invoke(principal);
        } catch (NoSuchMethodException e) {
            // Không log cảnh báo ở đây nếu là String "anonymousUser"
            if (!"anonymousUser".equals(principal)) {
                log.warn("Principal class {} does not have getId() method", principal.getClass().getName());
            }
        } catch (Exception e) {
            log.warn("Error invoking getId() on principal", e);
        }

        return null;
    }
}

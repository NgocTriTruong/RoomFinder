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
        
        // Principal có thể là Long (userId) hoặc UserDetails
        if (principal instanceof Long) {
            return principal;
        }

        // Thử lấy userId từ UserDetails
        try {
            var getIdMethod = principal.getClass().getMethod("getId");
            return getIdMethod.invoke(principal);
        } catch (Exception e) {
            log.warn("Could not get user ID from principal", e);
        }

        return null;
    }
}

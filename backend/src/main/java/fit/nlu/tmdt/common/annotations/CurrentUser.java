package fit.nlu.tmdt.common.annotations;

import java.lang.annotation.*;

/**
 * Annotation để inject current user vào controller method
 */
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CurrentUser {
    boolean required() default true;
}

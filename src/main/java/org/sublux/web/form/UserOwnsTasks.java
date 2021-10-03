package org.sublux.web.form;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = TaskAuthorshipValidator.class)
@Documented
public @interface UserOwnsTasks {
    String message() default "You must be the author of all tasks";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

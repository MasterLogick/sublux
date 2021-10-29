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
@Constraint(validatedBy = NotEmptyFileValidator.class)
@Documented
public @interface NotEmptyFile {
    String message() default "You must submit script file";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

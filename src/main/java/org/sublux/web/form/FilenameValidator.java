package org.sublux.web.form;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class FilenameValidator implements ConstraintValidator<Filename, String> {

    @Override
    public void initialize(Filename constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return !(value.contains("/") || value.contains("\\"));
    }
}

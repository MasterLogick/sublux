package org.sublux.web.form;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {
    }

    @Override
    public boolean isValid(Object o, ConstraintValidatorContext constraintValidatorContext) {
        if (o instanceof UserRegisterDTO) {
            return ((UserRegisterDTO) o).getPassword().equals(((UserRegisterDTO) o).getPasswordRepetition());
        } else {
            return false;
        }
    }
}

package org.sublux.web.form;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.sublux.auth.UserDetailsImpl;
import org.sublux.repository.TaskRepository;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class TaskAuthorshipValidator implements ConstraintValidator<UserOwnsTasks, List<Long>> {
    @Autowired
    private TaskRepository taskRepository;

    @Override
    public void initialize(UserOwnsTasks constraintAnnotation) {
    }

    @Override
    public boolean isValid(List<Long> l, ConstraintValidatorContext constraintValidatorContext) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return l.stream().allMatch(
                (id) -> taskRepository.findById(id).map(
                        task -> task.getAuthor().getId().equals(userDetails.getId())
                ).orElse(false));
    }
}

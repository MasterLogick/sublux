package org.sublux.web.form;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.sublux.auth.UserDetailsImpl;
import org.sublux.repository.TaskRepository;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Set;

public class TaskAuthorshipValidator implements ConstraintValidator<UserOwnsTasks, Object> {
    @Autowired
    private TaskRepository taskRepository;

    @Override
    public void initialize(UserOwnsTasks constraintAnnotation) {
    }

    @Override
    public boolean isValid(Object o, ConstraintValidatorContext constraintValidatorContext) {
        if (o instanceof Set) {
            Set l = (Set) o;
            if (l.size() > 0 && l.iterator().next() instanceof Long) {
                UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                Set<Long> tasks = (Set<Long>) o;
                if (tasks != null) {
                    return tasks.stream().allMatch(
                            (id) -> taskRepository.findById(id).map(
                                    task -> task.getAuthor().getId().equals(userDetails.getId())
                            ).orElse(false));
                }
            }
            return false;
        }
        return false;
    }
}

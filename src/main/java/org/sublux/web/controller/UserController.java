package org.sublux.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.sublux.auth.UserDetailsImpl;
import org.sublux.entity.User;
import org.sublux.serialization.UserLong;
import org.sublux.service.UserAlreadyExistsException;
import org.sublux.service.UserService;
import org.sublux.web.form.UserRegisterDTO;

import javax.management.relation.RoleNotFoundException;
import javax.validation.Valid;

@Controller
@RequestMapping(path = "/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/register")
    public ResponseEntity<Object> registerUser(@Valid UserRegisterDTO userRegisterDTO, BindingResult bindingResult) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        try {
            userService.registerUser(userRegisterDTO);
        } catch (UserAlreadyExistsException e) {
            bindingResult.addError(new FieldError("mail", "mail", e.getMessage()));
            throw new BindException(bindingResult);
        } catch (RoleNotFoundException e) {
            throw new BindException(bindingResult);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/me")
    public ResponseEntity<User> getUser(Authentication authentication) {
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                return ResponseEntity.ok(new UserLong((User) authentication.getPrincipal()));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

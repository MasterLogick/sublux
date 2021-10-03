package org.sublux.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.sublux.service.UserAlreadyExistsException;
import org.sublux.service.UserService;
import org.sublux.web.form.UserRegisterDTO;

import javax.management.relation.RoleNotFoundException;
import javax.validation.Valid;

@Controller
@RequestMapping(path = "/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/register")
    public String registerUser(@ModelAttribute("userDTO") @Valid UserRegisterDTO userRegisterDTO, BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "register_user";
        }
        try {
            userService.registerUser(userRegisterDTO);
        } catch (UserAlreadyExistsException | RoleNotFoundException e) {
            model.addAttribute("mailError", e.getMessage());
            return "register_user";
        }
        return "redirect:/user/login";
    }

    @GetMapping(path = "/register")
    public String showRegistrationForm(Model model) {
        UserRegisterDTO userRegisterDTO = new UserRegisterDTO();
        model.addAttribute("userDTO", userRegisterDTO);
        return "register_user";
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }
}

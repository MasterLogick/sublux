package org.sublux.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.sublux.auth.User;
import org.sublux.repository.UserRepository;

import java.util.ArrayList;
import java.util.Optional;

@Controller
@RequestMapping(path = "/user")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    public User getUser(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    @PostMapping(path = "/create")
    @ResponseBody
    public ApiResponse createUser(@RequestParam(name = "username") String username,
                                  @RequestParam(name = "mail") String mail,
                                  @RequestParam(name = "first_name", defaultValue = "", required = false) String firstName,
                                  @RequestParam(name = "last_name", defaultValue = "", required = false) String lastName,
                                  @RequestParam(name = "description", defaultValue = "", required = false) String description) {
        User user = new User();
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setDescription(description);
        user.setMail(mail);
        user.setTeams(new ArrayList<>());
        userRepository.save(user);
        return ApiResponse.OK;
    }

    @GetMapping(path = "/create")
    public String creationForm() {
        return "create_user";
    }
}

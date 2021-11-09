package org.sublux.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.sublux.entity.Role;
import org.sublux.entity.User;
import org.sublux.repository.RoleRepository;
import org.sublux.repository.UserRepository;
import org.sublux.web.form.UserRegisterDTO;

import javax.management.relation.RoleNotFoundException;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepossitory;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepossitory = roleRepository;
    }

    public void registerUser(UserRegisterDTO userRegisterDTO) throws UserAlreadyExistsException, RoleNotFoundException {
        if (userRepository.existsByUsername(userRegisterDTO.getUsername())) {
            throw new UserAlreadyExistsException("User with such username already exists: " + userRegisterDTO.getUsername());
        }
        if (userRepository.existsByMail(userRegisterDTO.getMail())) {
            throw new UserAlreadyExistsException("User with such mail already exists: " + userRegisterDTO.getMail());
        }
        User user = new User();
        user.setUsername(userRegisterDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));
        user.setFirstName("");
        user.setLastName("");
        user.setDescription("");
        user.setMail(userRegisterDTO.getMail());
        user.setTeams(new HashSet<>());
        Set<Role> roles = new HashSet<>();
        roles.add(roleRepossitory.findByName("USER").orElseThrow(() -> new RoleNotFoundException("Role USER not found")));
        user.setRoles(roles);
        userRepository.save(user);
    }
}

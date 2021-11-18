package org.sublux;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.sublux.entity.Role;
import org.sublux.isolation.privileged.UnprivilegedExecutorClient;
import org.sublux.repository.RoleRepository;

import java.io.IOException;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public UnprivilegedExecutorClient getExecutor() {
        try {
            return new UnprivilegedExecutorClient();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Bean
    public CommandLineRunner createUserRole(RoleRepository roleRepository) throws Exception {
        return (String[] args) -> {
            if (!roleRepository.findByName("USER").isPresent()) {
                Role userRole = new Role();
                userRole.setName("USER");
                roleRepository.save(userRole);
            }
        };
    }
}

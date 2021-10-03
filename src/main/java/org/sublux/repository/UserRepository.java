package org.sublux.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.sublux.auth.User;

import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<User, Integer> {
    boolean existsByUsername(String username);

    boolean existsByMail(String mail);

    Optional<User> findByUsername(String username);
}


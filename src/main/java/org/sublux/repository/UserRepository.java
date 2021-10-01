package org.sublux.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.sublux.auth.User;

import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}


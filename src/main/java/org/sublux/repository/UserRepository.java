package org.sublux.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.sublux.auth.User;

public interface UserRepository extends PagingAndSortingRepository<User, Integer> {
}

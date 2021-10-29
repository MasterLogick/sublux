package org.sublux.repository;

import org.springframework.data.repository.CrudRepository;
import org.sublux.entity.Role;

import java.util.Optional;

public interface RoleRepository extends CrudRepository<Role, Integer> {
    Optional<Role> findByName(String name);
}

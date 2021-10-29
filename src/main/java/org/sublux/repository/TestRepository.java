package org.sublux.repository;

import org.springframework.data.repository.CrudRepository;
import org.sublux.entity.Test;

public interface TestRepository extends CrudRepository<Test, Long> {
}

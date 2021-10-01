package org.sublux.repository;

import org.springframework.data.repository.CrudRepository;
import org.sublux.test.Test;

public interface TestRepository extends CrudRepository<Test, Long> {
}

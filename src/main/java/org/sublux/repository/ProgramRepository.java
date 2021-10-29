package org.sublux.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.sublux.entity.Program;

public interface ProgramRepository extends PagingAndSortingRepository<Program, Long> {
}

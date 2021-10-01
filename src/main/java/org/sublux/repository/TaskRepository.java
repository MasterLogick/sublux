package org.sublux.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.sublux.Task;

public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {
}

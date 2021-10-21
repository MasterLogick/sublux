package org.sublux.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.sublux.Task;
import org.sublux.auth.User;

public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {
    Page<Task> findAllByAuthor(User author, Pageable pageable);
}

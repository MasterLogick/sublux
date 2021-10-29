package org.sublux.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.sublux.entity.Contest;

public interface ContestRepository extends PagingAndSortingRepository<Contest, Integer> {

}

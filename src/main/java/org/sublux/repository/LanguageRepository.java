package org.sublux.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.sublux.entity.Language;

public interface LanguageRepository extends PagingAndSortingRepository<Language, Integer> {
    Page<Language> findAllByNameContains(String name, Pageable pageable);
}

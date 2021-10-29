package org.sublux.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.sublux.entity.Language;

public interface LanguageRepository extends PagingAndSortingRepository<Language, Integer> {
}

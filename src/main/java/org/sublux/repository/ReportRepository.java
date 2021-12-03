package org.sublux.repository;

import org.springframework.data.repository.CrudRepository;
import org.sublux.entity.Report;

public interface ReportRepository extends CrudRepository<Report, Long> {
}

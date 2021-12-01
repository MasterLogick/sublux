package org.sublux.repository;

import org.springframework.data.repository.CrudRepository;
import org.sublux.entity.EvaluationReport;
import org.sublux.entity.Task;
import org.sublux.entity.User;

import java.util.List;

public interface EvaluationReportRepository extends CrudRepository<EvaluationReport, Long> {
    List<EvaluationReport> findAllByTaskAndAuthor(Task task, User author);
}

package org.sublux.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.sublux.auth.UserDetailsImpl;
import org.sublux.repository.EvaluationReportRepository;
import org.sublux.serialization.EvaluationReportLong;

@Controller
@RequestMapping(path = "/api/report")
public class ReportController {
    private final EvaluationReportRepository evaluationReportRepository;

    public ReportController(EvaluationReportRepository evaluationReportRepository) {
        this.evaluationReportRepository = evaluationReportRepository;
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    public ResponseEntity<EvaluationReportLong> getEvaluationReport(@PathVariable Long id, Authentication authentication) {
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
                return evaluationReportRepository.findById(id)
                        .filter(evaluationReport -> evaluationReport.getAuthor().getId().equals(user.getId()))
                        .map(EvaluationReportLong::new)
                        .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

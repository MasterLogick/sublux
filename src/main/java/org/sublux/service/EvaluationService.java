package org.sublux.service;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.sublux.entity.*;
import org.sublux.isolation.*;
import org.sublux.repository.EvaluationReportRepository;
import org.sublux.repository.ReportRepository;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Service
public class EvaluationService {
    private final IsolationManager isolationManager;
    private final DockerTasksThreadPool dockerTasksThreadPool;
    private final EvaluationReportRepository evaluationReportRepository;
    private final ReportRepository reportRepository;

    public EvaluationService(IsolationManager isolationManager, DockerTasksThreadPool dockerTasksThreadPool, EvaluationReportRepository evaluationReportRepository, ReportRepository reportRepository) {
        this.isolationManager = isolationManager;
        this.dockerTasksThreadPool = dockerTasksThreadPool;
        this.evaluationReportRepository = evaluationReportRepository;
        this.reportRepository = reportRepository;
    }

    public void evaluateSolution(Task task, Program solution, User user) {
        Language lang = solution.getLang();
        boolean allowed = task.getAllowedLanguages().stream().anyMatch(l -> Objects.equals(l.getId(), lang.getId()));
        if (!allowed) throw new IllegalArgumentException("Solution language is disallowed for this task");
        if (!solution.getAuthor().getId().equals(user.getId()))
            throw new IllegalArgumentException("Solution author differs from provided user");
        List<TestCluster> clusterList = task.getClusters();
        for (TestCluster testCluster : clusterList) {
            Hibernate.initialize(testCluster.getTests());
        }
        EvaluationReport evaluationReport = new EvaluationReport();
        evaluationReport.setTask(task);
        evaluationReport.setEvaluatedProgram(solution);
        evaluationReport.setAuthor(user);
        HashMap<Test, Report> runReports = new HashMap<>();
        evaluationReport.setRunReports(runReports);
        Report buildReport = new Report(Report.State.PENDING);
        evaluationReport.setBuildReport(buildReport);
        save(evaluationReport);
        dockerTasksThreadPool.execute(() -> {
            BuildContainer buildContainer = null;
            try {
                buildContainer = isolationManager.createBuildContainer(lang);
            } catch (DockerException e) {
                e.printStackTrace();
                buildReport.setState(Report.State.DOCKER_EXCEPTION);
                save(buildReport);
            }
            if (buildContainer != null) {
                try {
                    buildContainer.buildSolution(solution, buildReport);
                } catch (IOException | InterruptedException e) {
                    e.printStackTrace();
                    buildReport.setState(Report.State.DOCKER_EXCEPTION);
                }
                save(buildReport);
                if (buildReport.getState() == Report.State.SUCCESS) {

                    for (TestCluster cluster : clusterList) {
                        RunContainer runContainer;
                        try {
                            runContainer = isolationManager.createRunContainer(lang, cluster);
                        } catch (DockerException e) {
                            e.printStackTrace();
                            for (Test test : cluster.getTests()) {
                                runReports.put(test, createFailedContainerCreateReport());
                            }
                            continue;
                        }
                        for (Test test : cluster.getTests()) {
                            Report runReport = new Report();
                            try {
                                runContainer.evaluateSolution(buildContainer, solution, test, runReport);
                            } catch (IOException | InterruptedException e) {
                                e.printStackTrace();
                                runReport.setState(Report.State.DOCKER_EXCEPTION);
                            }
                            runReports.put(test, runReport);
                            save(evaluationReport);
                        }
                        try {
                            runContainer.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
            try {
                buildContainer.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    @Transactional
    void save(EvaluationReport evaluationReport) {
        evaluationReportRepository.save(evaluationReport);
    }

    @Transactional
    void save(Report report) {
        reportRepository.save(report);
    }

    private Report createFailedContainerCreateReport() {
        Report report = new Report();
        report.setState(Report.State.DOCKER_EXCEPTION);
        report.setCompressedLog(new byte[0]);
        return report;
    }
}

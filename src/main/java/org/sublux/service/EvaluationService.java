package org.sublux.service;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.sublux.entity.*;
import org.sublux.isolation.*;
import org.sublux.repository.EvaluationReportRepository;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Service
public class EvaluationService {
    private final IsolationManager isolationManager;
    private final DockerTasksThreadPool dockerTasksThreadPool;
    private final EvaluationReportRepository evaluationReportRepository;

    public EvaluationService(IsolationManager isolationManager, DockerTasksThreadPool dockerTasksThreadPool, EvaluationReportRepository evaluationReportRepository) {
        this.isolationManager = isolationManager;
        this.dockerTasksThreadPool = dockerTasksThreadPool;
        this.evaluationReportRepository = evaluationReportRepository;
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
        dockerTasksThreadPool.execute(() -> {
            EvaluationReport evaluationReport = new EvaluationReport();
            evaluationReport.setTask(task);
            evaluationReport.setEvaluatedProgram(solution);
            evaluationReport.setAuthor(user);
            BuildContainer buildContainer = null;
            try {
                buildContainer = isolationManager.createBuildContainer(lang);
            } catch (DockerException e) {
                e.printStackTrace();
                evaluationReport.setBuildReport(createFailedContainerCreateReport());
            }
            if (buildContainer != null) {
                Report buildReport = null;
                try {
                    buildReport = buildContainer.buildSolution(solution);
                } catch (IOException | InterruptedException e) {
                    e.printStackTrace();
                    evaluationReport.setBuildReport(createFailedContainerCreateReport());
                }
                if (buildReport != null) {
                    evaluationReport.setBuildReport(buildReport);
                    if (buildReport.getState() == Report.State.SUCCESS) {
                        HashMap<Test, Report> runReports = new HashMap<>();
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
                                Report runReport = null;
                                try {
                                    runReport = runContainer.evaluateSolution(buildContainer, solution, test);
                                } catch (IOException | InterruptedException e) {
                                    e.printStackTrace();
                                    runReports.put(test, createFailedContainerCreateReport());
                                }
                                runReports.put(test, runReport);
                            }
                            try {
                                runContainer.close();
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                        evaluationReport.setRunReports(runReports);
                    }
                }
            }
            try {
                buildContainer.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            save(evaluationReport);
        });
    }

    @Transactional
    void save(EvaluationReport report) {
        evaluationReportRepository.save(report);
    }

    private Report createFailedContainerCreateReport() {
        Report report = new Report();
        report.setState(Report.State.DOCKER_EXCEPTION);
        report.setCompressedLog(new byte[0]);
        return report;
    }
}

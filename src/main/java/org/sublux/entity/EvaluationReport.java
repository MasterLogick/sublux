package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.serialization.EvaluationReportSerializer;

import javax.persistence.*;
import java.util.Map;

@Entity
@Table(name = "evaluation_report")
@JsonSerialize(using = EvaluationReportSerializer.class)
public class EvaluationReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "build_report_id")
    private Report buildReport;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "test_run_report_lookup",
            joinColumns = @JoinColumn(name = "evaluation_report"),
            inverseJoinColumns = @JoinColumn(name = "run_report"))
    @MapKeyJoinColumn(name = "test")
    private Map<Test, Report> runReports;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "evaluated_program_id")
    private Program evaluatedProgram;

    @OneToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Report getBuildReport() {
        return buildReport;
    }

    public void setBuildReport(Report buildReport) {
        this.buildReport = buildReport;
    }

    public Map<Test, Report> getRunReports() {
        return runReports;
    }

    public void setRunReports(Map<Test, Report> runReports) {
        this.runReports = runReports;
    }

    public Program getEvaluatedProgram() {
        return evaluatedProgram;
    }

    public void setEvaluatedProgram(Program evaluatedProgram) {
        this.evaluatedProgram = evaluatedProgram;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task problem) {
        this.task = problem;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}

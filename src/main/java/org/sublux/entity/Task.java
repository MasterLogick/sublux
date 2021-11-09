package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.serialization.TaskSerializer;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "task")
@JsonSerialize(using = TaskSerializer.class)
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "task_language_lookup",
            joinColumns = {@JoinColumn(name = "task_id")},
            inverseJoinColumns = {@JoinColumn(name = "lang_id")})
    private Set<Language> allowedLanguages;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Program inputValidator;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Program solution;

    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<TestCluster> clusters;

    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

    public Task() {
    }

    public Task(Long id, String name, String description, Set<Language> allowedLanguages, Program inputValidator, Program solution, Set<TestCluster> clusters, User author) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.allowedLanguages = allowedLanguages;
        this.inputValidator = inputValidator;
        this.solution = solution;
        this.clusters = clusters;
        this.author = author;
    }

    public Task(Task task) {
        id = task.getId();
        name = task.getName();
        description = task.getDescription();
        allowedLanguages = task.getAllowedLanguages();
        inputValidator = task.getInputValidator();
        solution = task.getSolution();
        clusters = task.getClusters();
        author = task.getAuthor();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Language> getAllowedLanguages() {
        return allowedLanguages;
    }

    public void setAllowedLanguages(Set<Language> allowedLanguages) {
        this.allowedLanguages = allowedLanguages;
    }

    public Program getInputValidator() {
        return inputValidator;
    }

    public void setInputValidator(Program inputValidator) {
        this.inputValidator = inputValidator;
    }

    public Program getSolution() {
        return solution;
    }

    public void setSolution(Program solution) {
        this.solution = solution;
    }

    public Set<TestCluster> getClusters() {
        return clusters;
    }

    public void setTestClusters(Set<TestCluster> clusters) {
        this.clusters = clusters;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}

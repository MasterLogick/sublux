package org.sublux;

import org.sublux.auth.User;
import org.sublux.test.Test;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "task_language_lookup",
            joinColumns = {@JoinColumn(name = "task_id")},
            inverseJoinColumns = {@JoinColumn(name = "lang_id")})
    private List<Language> allowedLanguages = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private Program inputValidator;

    @ManyToOne(fetch = FetchType.LAZY)
    private Program solution;

    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Test> tests;

    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

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

    public List<Language> getAllowedLanguages() {
        return allowedLanguages;
    }

    public void setAllowedLanguages(List<Language> allowedLanguages) {
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

    public List<Test> getTests() {
        return tests;
    }

    public void setTests(List<Test> tests) {
        this.tests = tests;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}

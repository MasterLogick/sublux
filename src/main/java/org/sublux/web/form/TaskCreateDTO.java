package org.sublux.web.form;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;

public class TaskCreateDTO {
    @NotNull
    @NotEmpty
    private String name;

    @NotNull
    @NotEmpty
    private String description;

    @NotNull
    @NotEmpty
    private Set<Integer> allowedLanguages;

    @NotNull
    private ProgramUploadDTO validator;

    @NotNull
    private ProgramUploadDTO solution;

    @NotNull
    @NotEmpty
    private Set<ClusterCreateDTO> tests;

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

    public Set<Integer> getAllowedLanguages() {
        return allowedLanguages;
    }

    public void setAllowedLanguages(Set<Integer> allowedLanguages) {
        this.allowedLanguages = allowedLanguages;
    }

    public ProgramUploadDTO getValidator() {
        return validator;
    }

    public void setValidator(ProgramUploadDTO validator) {
        this.validator = validator;
    }

    public ProgramUploadDTO getSolution() {
        return solution;
    }

    public void setSolution(ProgramUploadDTO solution) {
        this.solution = solution;
    }

    public Set<ClusterCreateDTO> getTests() {
        return tests;
    }

    public void setTests(Set<ClusterCreateDTO> tests) {
        this.tests = tests;
    }
}

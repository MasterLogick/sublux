package org.sublux.web.form;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

public class ClusterCreateDTO {
    @NotNull
    @NotEmpty
    private String name;

    @NotNull
    private Integer memoryLimit;
    @NotNull
    private Integer timeLimit;

    @NotNull
    @NotEmpty
    private List<TestCreateDTO> tests;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getMemoryLimit() {
        return memoryLimit;
    }

    public void setMemoryLimit(Integer memoryLimit) {
        this.memoryLimit = memoryLimit;
    }

    public Integer getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(Integer timeLimit) {
        this.timeLimit = timeLimit;
    }

    public List<TestCreateDTO> getTests() {
        return tests;
    }

    public void setTests(List<TestCreateDTO> tests) {
        this.tests = tests;
    }
}

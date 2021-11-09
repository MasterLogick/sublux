package org.sublux.web.form;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;

public class ClusterCreateDTO {
    @NotNull
    @NotEmpty
    private String name;

    @NotNull
    @NotEmpty
    private Set<TestCreateDTO> tests;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<TestCreateDTO> getTests() {
        return tests;
    }

    public void setTests(Set<TestCreateDTO> tests) {
        this.tests = tests;
    }
}

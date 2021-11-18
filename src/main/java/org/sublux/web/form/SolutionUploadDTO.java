package org.sublux.web.form;

import javax.validation.constraints.NotNull;

public class SolutionUploadDTO {

    @NotNull
    private Long taskId;

    @NotNull
    private ProgramUploadDTO solution;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public ProgramUploadDTO getSolution() {
        return solution;
    }

    public void setSolution(ProgramUploadDTO solution) {
        this.solution = solution;
    }
}

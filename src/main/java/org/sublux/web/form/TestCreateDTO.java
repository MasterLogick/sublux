package org.sublux.web.form;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class TestCreateDTO {
    @NotNull
    @NotEmpty
    private int points;

    @NotNull
    private byte[] input;

    @NotNull
    private byte[] output;

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public byte[] getInput() {
        return input;
    }

    public void setInput(byte[] input) {
        this.input = input;
    }

    public byte[] getOutput() {
        return output;
    }

    public void setOutput(byte[] output) {
        this.output = output;
    }
}

package org.sublux.web.form;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class FileDTO {
    @NotNull
    @NotEmpty
    @Filename
    private String name;

    @NotNull
    @NotEmpty
    private byte[] data;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
}

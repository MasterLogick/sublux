package org.sublux.web.form;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;

public class ProgramUploadDTO {
    @NotNull
    private Set<FileDTO> files;

    @NotNull
    @NotEmpty
    private Integer language;

    public Set<FileDTO> getFiles() {
        return files;
    }

    public void setFiles(Set<FileDTO> files) {
        this.files = files;
    }

    public Integer getLanguage() {
        return language;
    }

    public void setLanguage(Integer language) {
        this.language = language;
    }
}

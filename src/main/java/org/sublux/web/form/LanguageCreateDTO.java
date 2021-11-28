package org.sublux.web.form;

import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

public class LanguageCreateDTO {
    @NotNull
    @NotEmpty
    @Pattern(regexp = "^[a-zA-Z0-9_][a-zA-Z0-9_.-]{0,59}$", message = "Name must contain at least one alphanumerical or underscore symbol and do not exceed 60 symbols")
    private String name;

    @NotNull
    @NotEmptyFile
    private MultipartFile dockerTar;

    @NotNull
    @NotEmptyFile
    private MultipartFile buildScript;

    @NotNull
    @NotEmptyFile
    private MultipartFile runScript;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MultipartFile getDockerTar() {
        return dockerTar;
    }

    public void setDockerTar(MultipartFile dockerTar) {
        this.dockerTar = dockerTar;
    }

    public MultipartFile getBuildScript() {
        return buildScript;
    }

    public void setBuildScript(MultipartFile buildScript) {
        this.buildScript = buildScript;
    }

    public MultipartFile getRunScript() {
        return runScript;
    }

    public void setRunScript(MultipartFile runScript) {
        this.runScript = runScript;
    }
}

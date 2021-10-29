package org.sublux.web.form;

import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class LanguageCreateDTO {
    @NotNull
    @NotEmpty
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

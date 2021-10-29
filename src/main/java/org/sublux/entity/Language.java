package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.serializer.LanguageSerializer;

import javax.persistence.*;

@Entity
@Table(name = "language")
@JsonSerialize(using = LanguageSerializer.class)
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Lob
    @Column(name = "docker_tar")
    private byte[] dockerTar;

    @Lob
    @Column(name = "build_script")
    private byte[] buildScript;

    @Lob
    @Column(name = "run_script")
    private byte[] runScript;


    public Language() {
    }

    public Language(Language language) {
        id = language.getId();
        name = language.getName();
        dockerTar = language.dockerTar;
        buildScript = language.buildScript;
        runScript = language.getRunScript();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getDockerTar() {
        return dockerTar;
    }

    public void setDockerTar(byte[] dockerTar) {
        this.dockerTar = dockerTar;
    }

    public byte[] getBuildScript() {
        return buildScript;
    }

    public void setBuildScript(byte[] buildScript) {
        this.buildScript = buildScript;
    }

    public byte[] getRunScript() {
        return runScript;
    }

    public void setRunScript(byte[] runScript) {
        this.runScript = runScript;
    }
}

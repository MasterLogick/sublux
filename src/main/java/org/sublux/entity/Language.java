package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.isolation.LanguageImage;
import org.sublux.serialization.LanguageSerializer;

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

    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

    @Embedded
    private LanguageImage languageImage;

    public Language() {
    }

    public Language(Language language) {
        id = language.getId();
        name = language.getName();
        dockerTar = language.dockerTar;
        buildScript = language.buildScript;
        runScript = language.getRunScript();
        languageImage = language.languageImage;
        author = language.author;
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

    public LanguageImage getLanguageImage() {
        return languageImage;
    }

    public void setLanguageImage(LanguageImage languageImage) {
        this.languageImage = languageImage;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}

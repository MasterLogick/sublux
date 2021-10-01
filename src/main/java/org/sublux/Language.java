package org.sublux;

import javax.persistence.*;

@Entity
@Table(name = "language")
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Lob
    @Column(name = "build_script")
    private byte[] buildScript;

    @Lob
    @Column(name = "run_script")
    private byte[] runScript;

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

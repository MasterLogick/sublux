package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.serialization.ProgramSerializer;
import org.sublux.web.form.FileDTO;
import org.sublux.web.form.ProgramUploadDTO;

import javax.persistence.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Entity
@Table(name = "program")
@JsonSerialize(using = ProgramSerializer.class)
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    private Language lang;

    @Lob
    @Column(name = "archive")
    private byte[] archivedData;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Language getLang() {
        return lang;
    }

    public void setLang(Language lang) {
        this.lang = lang;
    }

    public byte[] getArchivedData() {
        return archivedData;
    }

    public void setArchivedData(byte[] archivedData) {
        this.archivedData = archivedData;
    }

    public void setArchivedData(ProgramUploadDTO dto) throws IOException {
        Set<FileDTO> files = dto.getFiles();
        ByteArrayOutputStream archiveData = new ByteArrayOutputStream();
        ZipOutputStream zos = new ZipOutputStream(archiveData);
        for (FileDTO file : files) {
            ZipEntry entry = new ZipEntry(file.getName());
            zos.putNextEntry(entry);
            zos.write(file.getData());
            zos.closeEntry();
        }
        zos.close();
        setArchivedData(archiveData.toByteArray());
    }
}

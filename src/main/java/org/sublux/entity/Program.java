package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.sublux.serialization.ProgramSerializer;
import org.sublux.web.form.FileDTO;
import org.sublux.web.form.ProgramUploadDTO;

import javax.persistence.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Set;

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
        TarArchiveOutputStream taos = new TarArchiveOutputStream(archiveData);
        taos.setAddPaxHeadersForNonAsciiNames(true);
        for (FileDTO file : files) {
            TarArchiveEntry entry = new TarArchiveEntry(file.getName());
            entry.setSize(file.getData().length);
            taos.putArchiveEntry(entry);
            taos.write(file.getData());
            taos.closeArchiveEntry();
        }
        taos.close();
        setArchivedData(archiveData.toByteArray());
    }
}

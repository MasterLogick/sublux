package org.sublux.entity;

import javax.persistence.*;

@Entity
@Table(name = "program")
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
}

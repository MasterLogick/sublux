package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.serialization.ReportSerializer;

import javax.persistence.*;

@Entity
@Table(name = "report")
@JsonSerialize(using = ReportSerializer.class)
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private State state;

    @Lob
    @Column(name = "compressed_log")
    private byte[] compressedLog;

    @ManyToOne
    @JoinColumn(name = "author")
    private User author;

    public Report() {
    }

    public Report(State state) {
        this.state = state;
    }

    public Report(Report report) {
        this.id = report.id;
        this.state = report.state;
        this.compressedLog = report.compressedLog;
        this.author = report.author;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public byte[] getCompressedLog() {
        return compressedLog;
    }

    public void setCompressedLog(byte[] compressedLog) {
        this.compressedLog = compressedLog;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public enum State {
        SUCCESS, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, VOLUME_QUOTA_EXCEEDED, RUNTIME_EXCEPTION, DOCKER_EXCEPTION, WRONG_ANSWER, PENDING
    }
}

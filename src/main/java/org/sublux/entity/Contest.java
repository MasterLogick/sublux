package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.serialization.ContestSerializer;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "contest")
@JsonSerialize(using = ContestSerializer.class)
public class Contest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Lob
    @Column(name = "description")
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "contest_task_lookup",
            joinColumns = {@JoinColumn(name = "contest_id")},
            inverseJoinColumns = {@JoinColumn(name = "task_id")})
    private List<Task> tasks;

    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}

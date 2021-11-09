package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.serialization.ContestSerializer;

import javax.persistence.*;
import java.util.Set;

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

    @Column(name = "description")
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "contest_task_lookup",
            joinColumns = {@JoinColumn(name = "contest_id")},
            inverseJoinColumns = {@JoinColumn(name = "task_id")})
    private Set<Task> tasks;

    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public Set<Task> getTasks() {
        return tasks;
    }

    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}

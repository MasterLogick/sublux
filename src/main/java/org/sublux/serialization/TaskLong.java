package org.sublux.serialization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.entity.Task;

@JsonSerialize(using = TaskLongSerializer.class)
public class TaskLong extends Task {
    public TaskLong(Task task) {
        super(task);
    }
}

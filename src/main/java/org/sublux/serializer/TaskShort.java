package org.sublux.serializer;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.entity.Task;

@JsonSerialize(using = TaskShortSerializer.class)
public class TaskShort extends Task {
    public TaskShort(Task task) {
        super(task);
    }
}

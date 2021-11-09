package org.sublux.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.Task;

import java.io.IOException;

public class TaskSerializer extends JsonSerializer<Task> {

    @Override
    public void serialize(Task value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("id", value.getId());
        generator.writeStringField("name", value.getName());
        generator.writeObjectField("author", value.getAuthor());
        generator.writeEndObject();
    }
}

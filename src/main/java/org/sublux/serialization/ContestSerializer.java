package org.sublux.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.Contest;
import org.sublux.entity.Task;

import java.io.IOException;

public class ContestSerializer extends JsonSerializer<Contest> {
    @Override
    public void serialize(Contest value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("id", value.getId());
        generator.writeStringField("name", value.getName());
        generator.writeStringField("description", value.getDescription());
        generator.writeObjectField("author", value.getAuthor());
        generator.writeArrayFieldStart("tasks");
        for (Task task : value.getTasks()) {
            generator.writeObject(task);
        }
        generator.writeEndArray();
        generator.writeEndObject();
    }
}

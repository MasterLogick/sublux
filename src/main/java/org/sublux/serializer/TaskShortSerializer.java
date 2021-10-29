package org.sublux.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class TaskShortSerializer extends JsonSerializer<TaskShort> {

    @Override
    public void serialize(TaskShort value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("id", value.getId());
        generator.writeStringField("name", value.getName());
        generator.writeObjectField("author", value.getAuthor());
        generator.writeEndObject();
    }
}

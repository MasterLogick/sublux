package org.sublux.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.Language;
import org.sublux.entity.Task;
import org.sublux.entity.TestCluster;

import java.io.IOException;

public class TaskLongSerializer extends JsonSerializer<Task> {
    @Override
    public void serialize(Task value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("id", value.getId());
        generator.writeStringField("name", value.getName());
        generator.writeStringField("description", value.getDescription());
        generator.writeArrayFieldStart("allowedLanguages");
        for (Language l : value.getAllowedLanguages()) {
            generator.writeObject(l);
        }
        generator.writeEndArray();
        generator.writeObjectField("validator", value.getInputValidator());
        generator.writeObjectField("solution", value.getSolution());
        generator.writeArrayFieldStart("tasks");
        for (TestCluster cluster : value.getClusters()) {
            generator.writeObject(new TestClusterLong(cluster));
        }
        generator.writeEndArray();
        generator.writeEndObject();
    }
}

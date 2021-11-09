package org.sublux.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.Test;
import org.sublux.entity.TestCluster;

import java.io.IOException;

public class TestClusterSerializer extends JsonSerializer<TestCluster> {
    @Override
    public void serialize(TestCluster value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeStringField("name", value.getName());
        generator.writeArrayFieldStart("tests");
        for (Test test : value.getTests()) {
            generator.writeObject(test);
        }
        generator.writeEndArray();
        generator.writeEndObject();
    }
}

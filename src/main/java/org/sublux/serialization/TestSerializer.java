package org.sublux.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.Test;

import java.io.IOException;

public class TestSerializer extends JsonSerializer<Test> {
    @Override
    public void serialize(Test value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("points", value.getPoints());
        generator.writeEndObject();
    }
}

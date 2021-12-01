package org.sublux.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.Report;

import java.io.IOException;

public class ReportSerializer extends JsonSerializer<Report> {
    @Override
    public void serialize(Report value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeStringField("state", value.getState().toString());
        generator.writeEndObject();
    }
}

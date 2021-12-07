package org.sublux.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class ReportLongSerializer extends JsonSerializer<ReportLong> {
    @Override
    public void serialize(ReportLong value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("id", value.getId());
        generator.writeStringField("state", value.getState().toString());
        generator.writeBinaryField("compressedLog", value.getCompressedLog());
        generator.writeEndObject();
    }
}

package org.sublux.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class LanguageLongSerializer extends JsonSerializer<LanguageLong> {
    @Override
    public void serialize(LanguageLong value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("id", value.getId());
        generator.writeStringField("name", value.getName());
        generator.writeBinaryField("dockerTar", value.getDockerTar());
        generator.writeBinaryField("buildScript", value.getBuildScript());
        generator.writeBinaryField("runScript", value.getRunScript());
        generator.writeEndObject();
    }
}

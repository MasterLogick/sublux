package org.sublux.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.Language;

import java.io.IOException;

public class LanguageSerializer extends JsonSerializer<Language> {
    @Override
    public void serialize(Language value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("id", value.getId());
        generator.writeStringField("name", value.getName());
        generator.writeEndObject();
    }
}

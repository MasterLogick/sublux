package org.sublux.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.auth.User;

import java.io.IOException;

public class UserShortSerializer extends JsonSerializer<User> {
    @Override
    public void serialize(User value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeStringField("username", value.getUsername());
        generator.writeNumberField("id", value.getId());
        generator.writeEndObject();
    }
}

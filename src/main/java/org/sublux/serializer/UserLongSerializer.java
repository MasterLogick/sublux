package org.sublux.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.Team;

import java.io.IOException;

public class UserLongSerializer extends JsonSerializer<UserLong> {
    @Override
    public void serialize(UserLong value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("id", value.getId());
        generator.writeStringField("username", value.getUsername());
        generator.writeStringField("first_name", value.getFirstName());
        generator.writeStringField("last_name", value.getLastName());
        generator.writeStringField("mail", value.getMail());
        generator.writeStringField("description", value.getDescription());
        generator.writeArrayFieldStart("teams");
        for (Team team : value.getTeams()) {
            generator.writeObject(team);
        }
        generator.writeEndArray();
        generator.writeEndObject();
    }
}

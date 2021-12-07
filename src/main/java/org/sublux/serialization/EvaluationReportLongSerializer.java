package org.sublux.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.Report;
import org.sublux.entity.Test;

import java.io.IOException;
import java.util.Map;

public class EvaluationReportLongSerializer extends JsonSerializer<EvaluationReportLong> {
    @Override
    public void serialize(EvaluationReportLong value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("id", value.getId());
        generator.writeObjectField("author", value.getAuthor());
        generator.writeObjectField("task", value.getTask());
        generator.writeObjectField("buildReport", new ReportLong(value.getBuildReport()));
        generator.writeArrayFieldStart("runReports");
        for (Map.Entry<Test, Report> entry : value.getRunReports().entrySet()) {
            generator.writeStartObject();
            generator.writeNumberField("testId", entry.getKey().getId());
            generator.writeObjectField("report", new ReportLong(entry.getValue()));
            generator.writeEndObject();
        }
        generator.writeEndArray();
        generator.writeEndObject();
    }
}

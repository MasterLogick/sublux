package org.sublux.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.sublux.entity.EvaluationReport;
import org.sublux.entity.Report;
import org.sublux.entity.Test;

import java.io.IOException;
import java.util.Map;

public class EvaluationReportSerializer extends JsonSerializer<EvaluationReport> {
    @Override
    public void serialize(EvaluationReport value, JsonGenerator generator, SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeObjectField("buildReport", value.getBuildReport());
        generator.writeArrayFieldStart("runReports");
        for (Map.Entry<Test, Report> entry : value.getRunReports().entrySet()) {
            generator.writeStartObject();
            generator.writeNumberField("testId", entry.getKey().getId());
            generator.writeObjectField("report", entry.getValue());
            generator.writeEndObject();
        }
        generator.writeEndArray();
        generator.writeEndObject();
    }
}

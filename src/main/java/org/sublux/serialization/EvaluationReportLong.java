package org.sublux.serialization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.entity.EvaluationReport;

@JsonSerialize(using = EvaluationReportLongSerializer.class)
public class EvaluationReportLong extends EvaluationReport {
    public EvaluationReportLong(EvaluationReport evaluationReport) {
        super(evaluationReport);
    }
}

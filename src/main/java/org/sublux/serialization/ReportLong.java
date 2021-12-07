package org.sublux.serialization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.entity.Report;

@JsonSerialize(using = ReportLongSerializer.class)
public class ReportLong extends Report {
    public ReportLong(Report report) {
        super(report);
    }
}

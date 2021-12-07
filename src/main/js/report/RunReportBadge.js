import {Badge} from "react-bootstrap";
import React from "react";
import {getReportColor, getReportLabel} from "./ReportBadgeUtil";

export default function RunReportBadge(props) {
    const {report: runReport, test} = props;
    if (runReport === undefined) return (<Badge bg="info">{`PENDING (?/${test?.points})`}</Badge>);
    return (
        <Badge bg={getReportColor(runReport)}>
            {`${getReportLabel(runReport)} (${runReport.state === "SUCCESS" ? test?.points : 0}/${test?.points})`}
        </Badge>
    )
}
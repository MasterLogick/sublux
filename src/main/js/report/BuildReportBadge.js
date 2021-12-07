import {Badge} from "react-bootstrap";
import React from "react";
import {getReportColor, getReportLabel} from "./ReportBadgeUtil";

export default function BuildReportBadge({report: buildReport}) {
    return (<Badge bg={getReportColor(buildReport)}>{getReportLabel(buildReport)}</Badge>)
}
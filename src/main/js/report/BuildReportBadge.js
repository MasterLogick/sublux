import {Badge} from "react-bootstrap";
import React from "react";
import {getReportColor, getReportLabel} from "./ReportBadgeUtil";

export default function BuildReportBadge(props) {
    const {report: buildReport} = props;

    return (<Badge bg={getReportColor(buildReport)}>{getReportLabel(buildReport)}</Badge>)
}
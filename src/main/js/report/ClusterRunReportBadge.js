import {getReport} from "./ReportBadgeUtil";
import RunReportBadge from "./RunReportBadge";
import React from "react";
import {Badge, OverlayTrigger, Popover, Stack} from "react-bootstrap";

export default function ClusterRunReportBadge({testCluster, runReports, popup}) {
    let totalSum = 0;
    let maxSum = 0;
    const testSet = [];
    let pending = 0;
    for (const test of testCluster?.tests) {
        maxSum += test.points;
        const report = getReport(runReports, test.id);
        if (report?.state === "SUCCESS") {
            totalSum += test.points;
        }
        if (report === undefined) {
            pending++;
        }
        if (popup)
            testSet.push(<RunReportBadge report={report} test={test} key={test.id}/>);
    }
    let bg = "";
    let label = `${totalSum}/${maxSum}`;
    if (totalSum >= maxSum) {
        bg = "success";
    } else if (totalSum * 2 >= maxSum) {
        bg = "warning";
    } else {
        bg = "danger";
    }
    if (pending > 0) {
        bg = "info";
        label = "PENDING";
    }
    if (popup) {
        return (
            <OverlayTrigger placement="bottom" overlay={
                <Popover>
                    <Popover.Body>
                        <Stack gap={2}>
                            {testSet}
                        </Stack>
                    </Popover.Body>
                </Popover>
            }>
                <Badge bg={bg}>{testCluster.name + ": " + label}</Badge>
            </OverlayTrigger>
        );
    } else {
        return (<Badge bg={bg}>{testCluster.name + ": " + label}</Badge>);
    }
}
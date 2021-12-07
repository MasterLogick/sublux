export {getReportColor, getReportLabel, getReport}

function getReportColor(report) {
    switch (report?.state) {
        case "SUCCESS":
            return "success";
        case "PENDING":
            return "info";
        case "TIME_LIMIT_EXCEEDED":
        case "MEMORY_LIMIT_EXCEEDED":
        case "VOLUME_QUOTA_EXCEEDED":
        case "RUNTIME_EXCEPTION":
        case "WRONG_ANSWER":
            return "danger";
        default:
            return "dark";

    }
}

function getReportLabel(report) {
    switch (report?.state) {
        case "SUCCESS":
            return "Success";
        case "PENDING":
            return "Info";
        case "TIME_LIMIT_EXCEEDED":
            return "Time limit exceeded"
        case "MEMORY_LIMIT_EXCEEDED":
            return "Memory limit exceeded"
        case "VOLUME_QUOTA_EXCEEDED":
            return "Volume quota exceeded";
        case "RUNTIME_EXCEPTION":
            return "Runtime exception"
        case "WRONG_ANSWER":
            return "Wrong answer";
        default:
            return "Internal error";
    }
}

function getReport(runReports, id) {
    return runReports.filter(rep => rep.testId === id)[0]?.report;
}
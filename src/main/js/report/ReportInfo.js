import React, {useEffect, useState} from "react";
import {Container, Tab, Table, Tabs} from "react-bootstrap";
import {useParams} from "react-router-dom";
import axios from "axios";
import BuildReportBadge from "./BuildReportBadge";
import {getReport} from "./ReportBadgeUtil";
import {Zlib} from "zlibjs/bin/inflate.dev.min";
import {RequireAuthorized} from "../Authorization";
import FancyCodeBlock from "../FancyCodeBlock";

export default function ReportInfo() {
    let {id} = useParams();
    const [evaluationReport, setEvaluationReport] = useState({});
    const [task, setTask] = useState(null);

    const buildLog = decompressLog(evaluationReport.buildReport?.compressedLog);

    useEffect(() => {
        axios.get(`/api/report/${id}`).then(reportResponse => {
            setEvaluationReport(reportResponse.data);
            axios.get(`/api/task/${reportResponse.data.task.id}`).then(taskResponse => {
                setTask(taskResponse.data);
            });
        }).catch(console.log);
    }, []);
    return (
        <Container>
            <RequireAuthorized/>
            <h2>Evaluation report {evaluationReport.name}</h2>
            <div className="mb-3">
                <h5>Build report: <BuildReportBadge report={evaluationReport.buildReport}/></h5>
                <h5>Build report log:</h5>
                <FancyCodeBlock inline={false}>
                    {buildLog || "EMPTY"}
                </FancyCodeBlock>
            </div>
            {evaluationReport.buildReport?.state === "SUCCESS" && <div>
                <h5>Run reports:</h5>
                <Tabs>
                    {task?.tasks?.map((cluster, key) => (
                        <Tab title={cluster.name} key={key} eventKey={key}>
                            <Table bordered>
                                <thead>
                                <tr>
                                    <td className="col-1">
                                        Report
                                    </td>
                                    <td>
                                        Log
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                {cluster.tests?.map((test, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>
                                                <FancyCodeBlock inline={false}>
                                                    {decompressLog(getReport(evaluationReport?.runReports, test.id)?.compressedLog) || "EMPTY"}
                                                </FancyCodeBlock>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                        </Tab>
                    ))}
                </Tabs>
            </div>}
        </Container>
    );
}

function decompressLog(compressedLog) {
    if (typeof compressedLog === "string" || compressedLog instanceof String) {
        const compressed = new Uint8Array(
            atob(
                compressedLog
            ).split('').map(x => x.charCodeAt(0)
            )
        );
        const decompressed = String.fromCharCode.apply(
            null, new Uint8Array(
                new Zlib.Inflate(compressed).decompress()
            )
        );
        return decompressed;
    }
    return null;
}
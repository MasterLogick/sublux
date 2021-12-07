import React, {useEffect, useState} from "react";
import {Container, Tab, Table, Tabs} from "react-bootstrap";
import {useParams} from "react-router-dom";
import axios from "axios";
import BuildReportBadge from "./BuildReportBadge";
import {getReport} from "./ReportBadgeUtil";
import {Zlib} from "zlibjs/bin/inflate.dev.min";
import {RequireAuthorized} from "../Authorization";

export default function ReportInfo() {
    let {id} = useParams();
    const [evaluationReport, setEvaluationReport] = useState({});
    const [task, setTask] = useState(null);
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
            <div>
                <h5>Build report: <BuildReportBadge report={evaluationReport.buildReport}/></h5>
            </div>
            <div>
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
                                    const log = getReport(evaluationReport?.runReports, test.id)?.compressedLog;
                                    const compressed = new Uint8Array(
                                        atob(
                                            log
                                        ).split('').map(x => x.charCodeAt(0)
                                        )
                                    );
                                    const decompressed = String.fromCharCode.apply(
                                        null, new Uint8Array(
                                            new Zlib.Inflate(compressed).decompress()
                                        )
                                    );
                                    return (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{decompressed}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                        </Tab>
                    ))}
                </Tabs>
            </div>
        </Container>
    );
}

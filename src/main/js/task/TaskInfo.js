import {Link, useHistory, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {isLogged, useUser} from "../Authorization";
import axios from "axios";
import {getProgramDTO, ProgramUploadFormGroup} from "../Program";
import {Badge, Button, Container, OverlayTrigger, Popover, Stack, Tab, Table, Tabs} from "react-bootstrap";
import {MarkdownDescription} from "../MarkdownDescription";
import BuildReportBadge from "../report/BuildReportBadge";
import RunReportBadge from "../report/RunReportBadge";
import {getReport} from "../report/ReportBadgeUtil";

export default function TaskInfo() {
    let {id} = useParams();
    let history = useHistory();
    const [task, setTask] = useState({});
    const [srcValidationError, setSrcValidationError] = useState(null);
    const [language, setLanguage] = useState(null);
    const [src, setSrc] = useState(null);
    const [mySolutions, setMySolutions] = useState(null);
    const isUserLogged = isLogged(useUser());

    useEffect(() => {
        axios.get(`/api/task/${id}`).then(resp => {
            setTask(resp.data);
        });
    }, []);
    useEffect(() => {
        if (isUserLogged)
            axios.get(`/api/solution/getMySolutions/${id}`).then(resp => {
                setMySolutions(resp.data);
            });
    }, []);

    function upload() {
        getProgramDTO(src, language).then(program => {
            const data = {
                taskId: id,
                solution: program
            };
            axios.post("/api/solution/upload", data).then(() => history.go(0)).catch(console.log);
        })
    }

    return (
        <Container>
            <h2>{task.name}</h2>
            <div className={"text-muted"}>
                Author: <Link to={`/user/${task.author?.id}`}
                              className={"text-secondary"}>{task.author?.username}</Link>
            </div>
            <hr/>
            <h5>Description</h5>
            <p><MarkdownDescription>{task.description}</MarkdownDescription></p>
            <hr/>
            <h5>Tests</h5>
            <div className={"my-1"}>
                Average time
                limit: <Badge
                bg={"secondary"}>{task.tasks?.map(cluster => cluster.timeLimit).reduce((a, b) => a + b, 0) / task.tasks?.length} ms</Badge>
            </div>
            <div className={"my-1"}>
                Average memory
                limit: <Badge
                bg={"secondary"}>{task.tasks?.map(cluster => cluster.memoryLimit).reduce((a, b) => a + b, 0) / task.tasks?.length} MB</Badge>
            </div>
            <Tabs>
                {task.tasks?.map((c, key) => (
                    <Tab key={key} title={c.name} eventKey={key}>
                        <div className={"my-1"}>
                            Time
                            limit: <Badge
                            bg={"secondary"}>{c.timeLimit} ms</Badge>
                        </div>
                        <div className={"my-1 mb-2"}>
                            Memory
                            limit: <Badge
                            bg={"secondary"}>{c.memoryLimit} MB</Badge>
                        </div>
                        <div className={"d-flex justify-content-start overflow-scroll"}>
                            {c.tests.map((t, i) => (
                                <h5 className={"mx-1"} key={i}><Badge bg={"warning"}>{t.points}p</Badge></h5>
                            ))}
                        </div>
                    </Tab>
                ))}
            </Tabs>
            <hr className="mt-0"/>
            {isUserLogged ?
                <>
                    <ProgramUploadFormGroup className="mb-3" name="upload"
                                            isSrcInvalid={srcValidationError != null}
                                            onSrcChange={setSrc} language={language} onLangChange={setLanguage}/>
                    <div className="d-flex justify-content-end">
                        <Button className="ms-auto" variant={"dark"} onClick={upload}>Upload</Button>
                    </div>
                    <hr/>
                    <Table bordered hover striped>
                        <thead>
                        <tr>
                            <td className="col-1">
                                #
                            </td>
                            <td className="col-2">
                                Build
                            </td>
                            <td>Run</td>
                        </tr>
                        </thead>
                        <tbody>
                        {mySolutions?.map((sol, key) => (
                            <tr key={key}>
                                <td><Link to={`/report/${sol.id}`}>{key + 1}</Link></td>
                                <td><BuildReportBadge report={sol.buildReport}/></td>
                                <td>{sol.buildReport.state === "SUCCESS" && getRunReportBadges(sol.runReports, task)}</td>
                            </tr>
                        )).reverse()}
                        </tbody>
                    </Table>
                </> :
                <>
                    <h5>
                        <Link to="/user/login">Log in</Link> to send your solution
                    </h5>
                </>
            }
        </Container>
    );
}

function getRunReportBadges(runReports, task) {
    const badges = [];
    for (const testCluster of task?.tasks) {
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
            testSet.push(<RunReportBadge report={report} test={test}/>);
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
        badges.push((
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
            </OverlayTrigger>));
    }
    return badges;
}

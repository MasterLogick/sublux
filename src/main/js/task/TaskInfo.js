import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {isLogged, useUser} from "../Authorization";
import axios from "axios";
import {getProgramDTO, ProgramUploadFormGroup} from "../Program";
import {Badge, Button, Container, Tab, Table, Tabs} from "react-bootstrap";
import {MarkdownDescription} from "../MarkdownDescription";
import BuildReportBadge from "../report/BuildReportBadge";
import RunReportBadge from "../report/RunReportBadge";
import {getReport} from "../report/ReportBadgeUtil";
import ClusterRunReportBadge from "../report/ClusterRunReportBadge";

export default function TaskInfo() {
    let {id} = useParams();
    const [task, setTask] = useState({});
    const [language, setLanguage] = useState(null);
    const [src, setSrc] = useState(null);
    const [mySolutions, setMySolutions] = useState(null);
    const isUserLogged = isLogged(useUser());
    const [bestSubmission, setBestSubmission] = useState();

    useEffect(() => {
        axios.get(`/api/task/${id}`).then(resp => {
            setTask(resp.data);
        });
    }, []);
    const update = () => {
        if (isUserLogged)
            axios.get(`/api/solution/getMySolutions/${id}`).then(resp => {
                setMySolutions(resp.data);
            });
    };
    useEffect(() => {
        if (mySolutions) {
            let best;
            let maxTotalPoints = 0;
            for (const solution of mySolutions) {
                if (solution.buildReport.state === "SUCCESS") {
                    let totalPoints = 0;
                    task.tasks.forEach(cluster => {
                        cluster.tests.forEach(test => {
                            const rep = getReport(solution.runReports, test.id);
                            if (rep.state === "SUCCESS") {
                                totalPoints += test.points;
                            }
                        })
                    })
                    if (totalPoints > maxTotalPoints) {
                        best = solution;
                        maxTotalPoints = totalPoints;
                    }
                }
            }
            if (maxTotalPoints > 0)
                setBestSubmission(best);
        }
    }, [mySolutions]);

    useEffect(update, []);

    function upload() {
        getProgramDTO(src, language).then(program => {
            const data = {
                taskId: id,
                solution: program
            };
            axios.post("/api/solution/upload", data).then(update).catch(console.log);
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
            {bestSubmission && <div className="mt-3">
                <h5>Your <a href="#" onClick={() => {
                    const link = document.getElementById(`report_${bestSubmission.id}`);
                    link.scrollIntoView();
                }
                }>best</a> submission:</h5>
                <Tabs>
                    {task.tasks?.map((c, key) => (
                        <Tab key={key}
                             title={<ClusterRunReportBadge runReports={bestSubmission.runReports} testCluster={c}/>}
                             eventKey={key}>
                            <div className={"my-1"}>
                                Time limit: <Badge
                                bg={"secondary"}>{c.timeLimit} ms</Badge>
                            </div>
                            <div className={"my-1 mb-2"}>
                                Memory limit: <Badge
                                bg={"secondary"}>{c.memoryLimit} MB</Badge>
                            </div>
                            <div className={"d-flex justify-content-start overflow-scroll"}>
                                {c.tests.map((t, i) => (
                                    <h5 className={"mx-1"} key={i}>
                                        <RunReportBadge report={getReport(bestSubmission.runReports, t.id)} test={t}/>
                                    </h5>
                                ))}
                            </div>
                        </Tab>
                    ))}
                </Tabs>
            </div>}
            <hr className="mt-0"/>
            {isUserLogged ?
                <>
                    <ProgramUploadFormGroup className="mb-3" name="upload"
                                            isSrcInvalid={false}
                                            onSrcChange={setSrc} language={language} onLangChange={setLanguage}
                                            allowedLanguages={task.allowedLanguages}/>
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
                                <td><Link to={`/report/${sol.id}`} id={`report_${sol.id}`}>{key + 1}</Link></td>
                                <td><BuildReportBadge report={sol.buildReport}/></td>
                                <td>{sol.buildReport.state === "SUCCESS" && task?.tasks.map((cluster, key) => (
                                    <ClusterRunReportBadge runReports={sol.runReports} testCluster={cluster}
                                                           key={key} popup/>
                                ))}</td>
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

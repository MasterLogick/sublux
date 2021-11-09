import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, CloseButton, Form, Modal, Tab, Table, Tabs} from "react-bootstrap";
import {RequireAuthorized} from "./Authorization";
import {fileToBase64File, stringToBase64} from "./Utill";

export {TestsEditor, getTestsDTO};

function getTestsDTO(testClusters) {
    return Promise.all(testClusters.map(getClusterDTO));
}

function getClusterDTO(cluster) {
    return new Promise((resolve, reject) => {
        Promise.all(cluster.tests.map(getTestDTO)).then(tests => {
            resolve({name: cluster.name, tests: tests});
        }).catch(reject);
    });
}

function getTestDTO(test) {
    return new Promise((resolve, reject) => {
        let input, output, points = test.points;
        if (test.inputFile != null) {
            input = fileToBase64File(test.inputFile);
        } else {
            input = Promise.resolve({data: stringToBase64(test.inputText)});
        }
        if (test.outputFile != null) {
            output = fileToBase64File(test.outputFile);
        } else {
            output = Promise.resolve({data: stringToBase64(test.outputText)});
        }
        input.then(inp => {
            output.then(out => {
                resolve({points: points, input: inp.data, output: out.data});
            })
        }).catch(reject);
    });
}

function newTest() {
    return {
        pointsRef: React.createRef(),
        inputRef: React.createRef(),
        outputRef: React.createRef(),
        points: "0",
        inputFile: null,
        outputFile: null,
        inputDrag: false,
        outputDrag: false,
        inputText: "",
        outputText: ""
    };
}

function newCluster() {
    return {name: "Cluster", tests: [newTest()]};
}

function TestClusterEditor(props) {
    const {tests, onChange: setTests} = props;

    return (
        <>
            <Table bordered>
                <thead>
                <tr>
                    <td className="col-1"/>
                    <td className="col-1">Points</td>
                    <td>Input</td>
                    <td>Output</td>
                </tr>
                </thead>
                <tbody>
                {tests.map((test, key) => (
                    <tr key={key}>
                        <td className={"d-flex justify-content-center"}><ButtonGroup size="sm" vertical>
                            <Button variant="dark" disabled={key === 0} onClick={() => {
                                setTests(tests.map((t, k) => {
                                    if (k === key - 1) return test;
                                    if (k === key) return tests[key - 1];
                                    return t;
                                }))
                            }}>↑</Button>
                            <Button variant="dark" disabled={tests.length === 1}
                                    onClick={() => setTests(tests.filter(t => test != t))}>x</Button>
                            <Button variant="dark" onClick={() => {
                                if (key === tests.length - 1) {
                                    setTests(tests.concat(newTest()));
                                } else {
                                    setTests(tests.map((t, k) => {
                                        if (k === key + 1) return test;
                                        if (k === key) return tests[key + 1];
                                        return t;
                                    }))
                                }
                            }}>{key === tests.length - 1 ? "+" : "↓"}</Button>
                        </ButtonGroup>
                        </td>
                        <td>
                            <Form.Control type="text" value={test.points} ref={test.pointsRef}
                                          placeholder="Points" name={`points${key}`} onChange={() => {
                                test.points = test.pointsRef.current.value;
                                setTests(tests.map((t, i) => i === key ? test : t));
                            }}/>
                        </td>
                        <td className={"position-relative"}>
                            {test.inputFile == null && <Form.Control
                                as="textarea"
                                placeholder="Type some text or drop a file..."
                                name={`input${key}`}
                                ref={test.inputRef}
                                value={test.inputText}
                                onChange={() => {
                                    test.inputText = test.inputRef.current.value;
                                    setTests(tests.map((t, i) => i === key ? test : t));
                                }}
                                onDragOver={event => {
                                    event.preventDefault();
                                    test.inputDrag = true;
                                    setTests(tests.map((t, i) => i === key ? test : t));
                                }}
                                className={"position-absolute top-0 start-0 w-100 h-100 overflow-scroll"}
                                style={{whiteSpace: "pre"}}
                            />}
                            {test.inputFile != null && (<>
                                <div
                                    className={"position-absolute top-50 start-50 translate-middle w-50 h-50 d-flex justify-content-center"}>
                                    <div className={"align-self-center"}>
                                        File {test.inputFile.name}
                                    </div>
                                </div>
                                <div className={"position-absolute top-0 end-0"}>
                                    <CloseButton onClick={() => {
                                        test.inputFile = null;
                                        setTests(tests.map((t, i) => i === key ? test : t));
                                    }}/>
                                </div>
                            </>)}
                            {test.inputDrag && (
                                <div
                                    style={{
                                        backgroundColor: "rgba(222,222,222,0.74)"
                                    }}
                                    onDrop={event => {
                                        event.preventDefault();
                                        test.inputFile = event.dataTransfer.files[0];
                                        test.inputDrag = false;
                                        test.inputText = "";
                                        setTests(tests.map((t, i) => i === key ? test : t));
                                    }}
                                    onDragOver={event => {
                                        event.preventDefault();
                                    }}
                                    onDragEnter={event => {
                                        event.preventDefault();
                                        test.inputDrag = true;
                                        setTests(tests.map((t, i) => i === key ? test : t));
                                    }}
                                    onDragLeave={event => {
                                        event.preventDefault();
                                        test.inputDrag = false;
                                        setTests(tests.map((t, i) => i === key ? test : t));
                                    }}
                                    className={"position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center"}
                                >
                                    <div className={"align-self-center"}>
                                        Drop file here
                                    </div>
                                </div>
                            )}
                        </td>
                        <td className={"position-relative"}>
                            {test.outputFile == null && <Form.Control
                                as="textarea"
                                placeholder="Type some text or drop a file..."
                                name={`output${key}`}
                                ref={test.outputRef}
                                value={test.outputText}
                                onChange={() => {
                                    test.outputText = test.outputRef.current.value;
                                    setTests(tests.map((t, i) => i === key ? test : t));
                                }}
                                onDragOver={event => {
                                    event.preventDefault();
                                    test.outputDrag = true;
                                    setTests(tests.map((t, i) => i === key ? test : t));
                                }}
                                className={"position-absolute top-0 start-0 w-100 h-100 overflow-scroll"}
                                style={{whiteSpace: "pre"}}
                            />}
                            {test.outputFile != null && (<>
                                <div
                                    className={"position-absolute top-50 start-50 translate-middle w-50 h-50 d-flex justify-content-center"}>
                                    <div className={"align-self-center"}>
                                        File {test.outputFile.name}
                                    </div>
                                </div>
                                <div className={"position-absolute top-0 end-0"}>
                                    <CloseButton onClick={() => {
                                        test.outputFile = null;
                                        setTests(tests.map((t, i) => i === key ? test : t));
                                    }}/>
                                </div>
                            </>)}
                            {test.outputDrag && (
                                <div
                                    style={{
                                        backgroundColor: "rgba(222,222,222,0.74)"
                                    }}
                                    onDrop={event => {
                                        event.preventDefault();
                                        test.outputFile = event.dataTransfer.files[0];
                                        test.outputDrag = false;
                                        test.outputText = "";
                                        setTests(tests.map((t, i) => i === key ? test : t));
                                    }}
                                    onDragOver={event => {
                                        event.preventDefault();
                                    }}
                                    onDragEnter={event => {
                                        event.preventDefault();
                                        test.outputDrag = true;
                                        setTests(tests.map((t, i) => i === key ? test : t));
                                    }}
                                    onDragLeave={event => {
                                        event.preventDefault();
                                        test.outputDrag = false;
                                        setTests(tests.map((t, i) => i === key ? test : t));
                                    }}
                                    className={"position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center"}
                                >
                                    <div className={"align-self-center"}>
                                        Drop file here
                                    </div>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}

function TestsEditor(props) {
    const {testClusters, onChange: setTestClusters, label, ...other} = props;
    const [selected, setSelected] = useState("0");
    const [showModal, setShowModal] = useState(false);
    const [currentEditingIndex, setCurrentEditingIndex] = useState(0);
    let editRef = React.createRef();

    useEffect(() => {
        if (testClusters.length === 0) {
            setTestClusters([newCluster()]);
        }
    });

    if (parseInt(selected) >= testClusters.length && testClusters.length > 0) {
        setSelected(`${testClusters.length - 1}`);
    }

    return (
        <div {...other}>
            <RequireAuthorized/>
            {label}
            <div className="rounded-3 border border-light border-3 p-3">
                <Tabs onSelect={tab => {
                    if (tab === "new") {
                        setTestClusters(testClusters.concat(newCluster()));
                        setSelected(`${testClusters.length}`);
                    } else {
                        setSelected(tab);
                    }
                }} activeKey={selected}>
                    {testClusters.map((cluster, key) => (
                        <Tab eventKey={key} key={key} title={<div className={"d-flex align-items-center"}>
                            {cluster.name}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="mx-1 bi bi-pencil-fill" viewBox="0 0 16 16" onClick={() => {
                                setShowModal(true);
                                setCurrentEditingIndex(key);
                            }}>
                                <path
                                    d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                            </svg>
                            <CloseButton
                                onClick={() => {
                                    setSelected(`${Math.max(0, key - 1)}`);
                                    if (testClusters.length >= 2)
                                        setTestClusters(testClusters.filter(c => c != cluster));
                                    else {
                                        setTestClusters([newCluster()]);
                                    }
                                }}/>
                        </div>}>
                            <TestClusterEditor tests={cluster.tests}
                                               onChange={(altered) => setTestClusters(testClusters.map(c => {
                                                   if (c == cluster) {
                                                       c.tests = altered;
                                                   }
                                                   return c;
                                               }))}/>
                        </Tab>
                    ))}
                    <Tab eventKey={"new"} title={"+"}/>
                </Tabs>
            </div>
            {showModal && (
                <Modal centered show>
                    <Modal.Header>
                        <Modal.Title>
                            Edit cluster name
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control autoFocus type="text" ref={editRef}
                                      defaultValue={testClusters[currentEditingIndex].name}
                                      placeholder="Change name" name="editClusterName"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => {
                            setShowModal(false);
                            setTestClusters(testClusters.map((cluster, index) => {
                                if (index === currentEditingIndex) {
                                    cluster.name = editRef.current.value;
                                }
                                return cluster;
                            }))
                        }}>Save</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
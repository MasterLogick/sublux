import React, {useEffect, useState} from "react";
import {Link, Route, Switch, useHistory, useParams} from "react-router-dom";
import {Button, CloseButton, Col, Container, Dropdown, Form, Row, Stack} from "react-bootstrap";
import {RequireAuthorized} from "./Authorization";
import axios from "axios";
import PagedList from "./PagedList";
import DropdownMenu from "react-bootstrap/DropdownMenu";

export {LanguageSelector};
export default function Language(props) {
    return (
        <Switch>
            <Route path={`${props.match.path}create`} exact component={LanguageCreateForm}/>
            <Route path={`${props.match.path}`} exact component={LanguageList}/>
            <Route path={`${props.match.path}:id`} component={LanguageInfo}/>
        </Switch>
    );
}

function LanguageCreateForm() {
    let name = React.createRef();
    let dockerTar = React.createRef();
    let buildScript = React.createRef();
    let runScript = React.createRef();
    const [nameValidationError, setNameValidationError] = useState(null);
    const [dockerTarValidationError, setDockerTarValidationError] = useState(null);
    const [buildScriptValidationError, setBuildScriptValidationError] = useState(null);
    const [runScriptValidationError, setRunScriptValidationError] = useState(null);

    let history = useHistory();

    function onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        setNameValidationError(null);
        setDockerTarValidationError(null);
        setBuildScriptValidationError(null);
        setRunScriptValidationError(null);
        let valid = true;
        if (dockerTar.current.files.length === 0) {
            setDockerTarValidationError("Select tar archive for docker image build");
            valid = false;
        }
        if (buildScript.current.files.length === 0) {
            setBuildScriptValidationError("Select build script file");
            valid = false;
        }
        if (runScript.current.files.length === 0) {
            setRunScriptValidationError("Select run script file");
            valid = false;
        }
        if (!valid) return;
        let form = new FormData();
        form.append("name", name.current.value);
        form.append("dockerTar", dockerTar.current.files[0]);
        form.append("buildScript", buildScript.current.files[0]);
        form.append("runScript", runScript.current.files[0]);
        axios.post("/api/language/create", form).then(() => history.push("/language")).catch(err => {
            for (const error of err.response.data.errorList) {
                switch (error.objectName) {
                    case "name":
                        setNameValidationError(error.message);
                        break;
                    case "dockerTar":
                        setDockerTarValidationError(error.message);
                        break;
                    case "buildScript":
                        setBuildScriptValidationError(error.message);
                        break;
                    case "runScript":
                        setRunScriptValidationError(error.message);
                        break;
                }
            }
        });
    }

    return (
        <Container>
            <RequireAuthorized/>
            <h3>Create new language</h3>
            <Form noValidate onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" name="name" ref={name}
                                  isInvalid={nameValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{nameValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDockerTarScript">
                    <Form.Label>Tar archive for building docker <Link to={"/help"}>image</Link></Form.Label>
                    <Form.Control type="file" placeholder="Choose tar archive for docker image build" name="dockerTar"
                                  ref={dockerTar}
                                  isInvalid={dockerTarValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{dockerTarValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBuildScript">
                    <Form.Label>Build script</Form.Label>
                    <Form.Control type="file" placeholder="Choose build script" name="buildScript" ref={buildScript}
                                  isInvalid={buildScriptValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{buildScriptValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRunScript">
                    <Form.Label>Run script</Form.Label>
                    <Form.Control type="file" placeholder="Choose run script" name="runScript" ref={runScript}
                                  isInvalid={runScriptValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{runScriptValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit" variant="dark">Create</Button>
                </Form.Group>
            </Form>
        </Container>
    );
}

function LanguageList() {
    return (
        <Container>
            <Row>
                <Col>
                    <h2>Language list</h2>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Link to={"/language/create"}>
                        <Button variant="outline-dark">Create language</Button>
                    </Link>
                </Col>
            </Row>
            <PagedList url={"/api/language/all"}
                       header={<tr>
                           <th className={"col-9"}>Name</th>
                       </tr>}
                       objectMapper={obj => (
                           <>
                               <td><Link to={`/language/${obj.id}`}>{obj.name}</Link></td>
                           </>
                       )}/>
        </Container>
    );
}

function LanguageInfo() {
    let {id} = useParams();
    const [language, setLanguage] = useState();
    useEffect(() => {
        axios.get(`/api/language/${id}`).then(resp => {
            const data = resp.data;
            setLanguage({
                name: data.name,
                buildScript: atob(data.buildScript),
                runScript: atob(data.runScript)
            });
        })
    }, [])
    if (language === undefined) return null;
    return (
        <Container>
            <h2>Language {language.name} info</h2>
            <hr/>
            <div className={"mb-3"}>
                <h4>Build script</h4>
                <Form.Control as={"textarea"} readOnly value={language.buildScript} style={{height: "450px"}}/>
            </div>
            <h4>Run script</h4>
            <Form.Control as={"textarea"} readOnly value={language.runScript} style={{height: "450px"}}/>
        </Container>
    );
}

function FilteredLanguageList(props) {
    const [languages, setLanguages] = useState([]);
    const [filter, setFilter] = useState("");
    props.filterProxy.m = setFilter;
    const selected = props?.selected || [];
    const multiple = props?.multiple || false;
    const setSelected = props.setSelected;

    useEffect(() => {
        axios.get("/api/language/search", {
            params: {
                filter: filter,
                perPage: 20
            }
        }).then(resp => setLanguages(resp.data.content));
    }, [filter]);
    return (
        <>
            {languages.filter(lang => !selected.map(l => l.name).includes(lang.name)).map((lang, key) => (
                <Dropdown.Item key={key} onClick={() => {
                    if (multiple)
                        setSelected(selected.concat(lang));
                    else
                        setSelected([lang]);
                }}>{lang.name}</Dropdown.Item>
            ))}
        </>
    );
}

function LanguageSelector(props) {
    let filterProxy = {m: null};
    const [selected, setSelected] = useState(props?.value || []);
    const multiple = props?.multiple || false;
    const onSelect = props.onSelect;

    const Toggle = React.forwardRef(({onClick}, ref) => {
        return (
            <Stack direction="horizontal" gap={2}>
                {selected.map((lang, key) => (
                    <div className={"px-1 border border-1 border-dark rounded-3 d-flex align-items-center"}
                         style={{whiteSpace: "nowrap"}}>
                        {lang.name} <CloseButton onClick={() => setSelected(selected.filter(it => it != lang))}/>
                    </div>
                ))}
                <input className={"form-select"} type="text" ref={ref} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick(e);
                }} onChange={e => {
                    filterProxy.m(e.target.value);
                }} placeholder="Select language" disabled={!multiple && selected.length > 0}/>
            </Stack>
        );
    });

    return (
        <Dropdown>
            <Dropdown.Toggle as={Toggle} id="language-toggle"/>
            <DropdownMenu id="language-dropdown">
                <FilteredLanguageList filterProxy={filterProxy} setSelected={(arr) => {
                    setSelected(arr);
                    onSelect(arr);
                }} selected={selected} multiple={multiple}/>
            </DropdownMenu>
        </Dropdown>
    );
}
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Container, Form} from "react-bootstrap";

export default function LanguageInfo() {
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
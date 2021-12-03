import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Container} from "react-bootstrap";
import {MarkdownDescription} from "../MarkdownDescription";

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
                <h4>Docker archive</h4>
                <a href={`/api/language/getDockerTar/${id}`} download>Download</a>
            </div>
            <div className={"mb-3"}>
                <h4>Build script</h4>
                <MarkdownDescription>{`~~~bash\n${language.buildScript}`}</MarkdownDescription>
            </div>
            <h4>Run script</h4>
            <MarkdownDescription>{`~~~bash\n${language.runScript}`}</MarkdownDescription>
        </Container>
    );
}
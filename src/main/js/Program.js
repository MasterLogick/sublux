import React from "react";
import {Form} from "react-bootstrap";
import {RequireAuthorized} from "./Authorization";
import LanguageSelector from "./language/LanguageSelector";
import {fileToBase64File} from "./Utill";

export {ProgramUploadFormGroup, getProgramDTO};

function getProgramDTO(files, language) {
    return new Promise((resolve, reject) => {
        Promise.all(Array.from(files).map(fileToBase64File)).then(converted => {
            resolve({files: converted, language: language[0].id});
        }).catch(reject);
    });
}

function ProgramUploadFormGroup(props) {
    const {label, name, isSrcInvalid, srcValidationError, onSrcChange, language, onLangChange, ...other} = props;
    let fileRef = React.createRef();

    return (
        <div {...other}>
            <RequireAuthorized/>
            {label}
            <div className="rounded-3 border border-light border-3 p-3">
                <Form.Group className="mb-3">
                    <Form.Label>Select source code</Form.Label>
                    <Form.Control type="file" placeholder="Source code" name={name + "Src"} isInvalid={isSrcInvalid}
                                  onChange={() => {
                                      onSrcChange(fileRef.current.files);
                                  }} multiple ref={fileRef}/>
                    <Form.Control.Feedback type={"invalid"}>{srcValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Select language</Form.Label>
                    <LanguageSelector value={language} onSelect={onLangChange}/>
                </Form.Group>
            </div>
        </div>
    );
}
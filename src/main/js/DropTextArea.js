import {CloseButton, Form} from "react-bootstrap";
import React, {useState} from "react";

export {DropTextArea};

function DropTextArea({
                          file,
                          text,
                          onTextChange,
                          onFileChange,
                          className,
                          ...others
                      }) {
    const [drag, setDrag] = useState(false);
    const ref = React.createRef();
    return (
        <div className={"position-relative w-100 h-100" + (className ? className : "")}
             style={{display: "inline table"}} {...others}>
            {file == null && <Form.Control
                as="textarea"
                placeholder="Type some text or drop a file..."
                name="textArea"
                ref={ref}
                value={text}
                onChange={() => onTextChange(ref.current.value)}
                onDragOver={event => {
                    event.preventDefault();
                    setDrag(true);
                }}
                className={"position-absolute top-0 start-0 w-100 h-100 overflow-scroll"}
                style={{whiteSpace: "pre"}}
            />}
            {file != null && (<>
                <div
                    className={"position-absolute top-50 start-50 translate-middle w-50 h-50 d-flex justify-content-center"}>
                    <div className={"align-self-center"}>
                        File {file.name}
                    </div>
                </div>
                <div className={"position-absolute top-0 end-0"}>
                    <CloseButton onClick={() => onFileChange(null)}/>
                </div>
            </>)}
            {drag && (
                <div
                    style={{
                        backgroundColor: "rgba(222,222,222,0.74)"
                    }}
                    onDrop={event => {
                        event.preventDefault();
                        onFileChange(event.dataTransfer.files[0]);
                        setDrag(false);
                        onTextChange("");
                    }}
                    onDragOver={event => {
                        event.preventDefault();
                    }}
                    onDragEnter={event => {
                        event.preventDefault();
                        setDrag(true);
                    }}
                    onDragLeave={event => {
                        event.preventDefault();
                        setDrag(false);
                    }}
                    className={"position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center"}
                >
                    <div className={"align-self-center"}>
                        Drop file here
                    </div>
                </div>
            )}
        </div>
    );
}
import {Button, ButtonGroup, Table} from "react-bootstrap";
import React from "react";

export {EditableTable};

function EditableTable(props) {
    const {data, onChange: setData, dataMapper, newElement, columns, ...others} = props;

    return (
        <Table {...others}>
            <thead>
            <tr>
                <td className="col-1"/>
                {columns}
            </tr>
            </thead>
            <tbody>
            {data.map((element, key) => (
                <tr key={key}>
                    <td className={"d-flex justify-content-center"}><ButtonGroup size="sm" vertical>
                        <Button variant="dark" disabled={key === 0} onClick={() => {
                            setData(data.map((t, k) => {
                                if (k === key - 1) return element;
                                if (k === key) return data[key - 1];
                                return t;
                            }))
                        }}>↑</Button>
                        <Button variant="dark" disabled={data.length === 1}
                                onClick={() => setData(data.filter(t => element != t))}>x</Button>
                        <Button variant="dark" onClick={() => {
                            if (key === data.length - 1) {
                                setData(data.concat(newElement()));
                            } else {
                                setData(data.map((t, k) => {
                                    if (k === key + 1) return element;
                                    if (k === key) return data[key + 1];
                                    return t;
                                }))
                            }
                        }}>{key === data.length - 1 ? "+" : "↓"}</Button>
                    </ButtonGroup>
                    </td>
                    {dataMapper(element, key)}
                </tr>
            ))}
            </tbody>
        </Table>
    );
}
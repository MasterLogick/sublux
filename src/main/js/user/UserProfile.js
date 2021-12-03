import {RequireAuthorized, useUser} from "../Authorization";
import {Container, Stack, Table} from "react-bootstrap";
import React from "react";

export default function UserProfile() {
    let user = useUser();
    return (<Container>
        <RequireAuthorized/>
        <Stack direction={"horizontal"} gap={3}>
            <h2 className={"align-self-end mb-0"}>
                {user.username}
            </h2>
            <h6 className={"text-muted align-self-end"} style={{marginBottom: ".18rem"}}>
                {`${user.first_name} ${user.last_name}`}
            </h6>
        </Stack>
        <hr/>
        <Table borderless>
            <tbody>
            <tr>
                <td className="col-3">Description:</td>
                <td>{user.description}</td>
            </tr>
            <tr>
                <td>Mail:</td>
                <td>
                    {user.mail}
                </td>
            </tr>
            </tbody>
        </Table>
    </Container>);
}
import React from "react";
import {Container, Pagination} from "react-bootstrap";

export {ContestList};

class ContestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentPage: 1, totalPages: 1};

    }

    render() {
        return (
            <Container fluid>
                <Pagination>
                    <Pagination.First/>
                    <Pagination.Prev/>
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Ellipsis/>

                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis/>
                    <Pagination.Item>{20}</Pagination.Item>
                    <Pagination.Next/>
                    <Pagination.Last/>
                </Pagination>
            </Container>
        );
    }
}
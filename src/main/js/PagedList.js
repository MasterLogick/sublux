import React, {useEffect, useState} from "react";
import axios from "axios";
import {Nav, Pagination, Table} from "react-bootstrap";

export default function ContestList(props) {
    const [currentPage, setCurrentPage] = useState(props?.currentPage || 0);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([]);
    const perPage = props?.perPage || 20;
    const objectMapper = props?.objectMapper;
    const url = props?.url;
    let fetcher = props?.fetcher;
    let fetch;
    const header = props?.header || null;

    if (url !== null) {
        fetch = () => {
            axios.get(url, {
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            }).then(data => {
                setData(data.data.content);
                setTotalPages(data.data.totalPages);
            });
        }
    } else {
        fetch = () => {
            fetcher(currentPage, perPage).then((data, totalPages) => {
                setData(data);
                setTotalPages(totalPages);
            });
        }
    }

    useEffect(fetch, [currentPage]);

    return (
        <>
            <Table responsive bordered hover>
                <thead>
                {header}
                </thead>
                <tbody>
                {data.map((obj, index) => (
                    <tr key={index}>
                        {objectMapper(obj)}
                    </tr>
                ))}
                </tbody>
            </Table>
            <Nav className="justify-content-end">
                <Pagination size={"sm"}>
                    {/*previous page*/}
                    <Pagination.Item onClick={() => setCurrentPage(currentPage - 1)}
                                     activeLabel={""}
                                     disabled={currentPage === 0}>
                        {"<"}
                    </Pagination.Item>

                    {currentPage >= 3 ?
                        <>
                            {/*the first page*/}
                            <Pagination.Item onClick={() => setCurrentPage(0)}
                                             activeLabel={""}>
                                {1}
                            </Pagination.Item>

                            {/*ellipsis*/}
                            <Pagination.Item activeLabel={""}>
                                {"..."}
                            </Pagination.Item>
                        </> : <></>}

                    {/*page # currentPage - 2*/}
                    {currentPage >= 2 ?
                        <Pagination.Item
                            onClick={() => setCurrentPage(currentPage - 2)}
                            activeLabel={""}>
                            {currentPage + 1 - 2}
                        </Pagination.Item>
                        : <></>}

                    {/*page # currentPage - 1*/}
                    {currentPage >= 1 ?
                        <Pagination.Item
                            onClick={() => setCurrentPage(currentPage - 1)}
                            activeLabel={""}>
                            {currentPage + 1 - 1}
                        </Pagination.Item>
                        : <></>}

                    {/*page # currentPage*/}
                    <Pagination.Item active
                                     activeLabel={""}>
                        {currentPage + 1}
                    </Pagination.Item>

                    {/*page # currentPage + 1*/}
                    {totalPages >= currentPage + 1 + 1 ?
                        <Pagination.Item
                            onClick={() => setCurrentPage(currentPage + 1)}
                            activeLabel={""}>
                            {currentPage + 1 + 1}
                        </Pagination.Item>
                        : <></>}

                    {/*page # currentPage + 2*/}
                    {totalPages >= currentPage + 1 + 2 ?
                        <Pagination.Item
                            onClick={() => setCurrentPage(currentPage + 2)}
                            activeLabel={""}>
                            {currentPage + 1 + 2}
                        </Pagination.Item>
                        : <></>}

                    {totalPages >= currentPage + 1 + 3 ?
                        <>
                            {/*ellipsis*/}
                            <Pagination.Item
                                activeLabel={""}>
                                {"..."}
                            </Pagination.Item>
                            {/*the last page*/}
                            <Pagination.Item
                                onClick={() => setCurrentPage(totalPages - 1)}
                                activeLabel={""}>
                                {totalPages}
                            </Pagination.Item>
                        </> : <></>}

                    {/*next page*/}
                    <Pagination.Item
                        onClick={() => setCurrentPage(currentPage + 1)}
                        activeLabel={""}
                        disabled={currentPage + 1 === totalPages}>
                        {">"}
                    </Pagination.Item>
                </Pagination>
            </Nav>
        </>
    );
}
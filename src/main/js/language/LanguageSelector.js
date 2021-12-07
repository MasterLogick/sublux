import React, {useEffect, useState} from "react";
import axios from "axios";
import {CloseButton, Dropdown, Stack} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";

export default function LanguageSelector({value, multiple, onSelect, allowedLanguages}) {
    let filterProxy = {m: null};
    const [selected, setSelected] = useState(value || []);
    multiple = multiple || false;

    const Toggle = React.forwardRef(({onClick}, ref) => {
        return (
            <Stack direction="horizontal" gap={2}>
                {selected.map((lang, key) => (
                    <div className={"px-1 border border-1 border-dark rounded-3 d-flex align-items-center"}
                         style={{whiteSpace: "nowrap"}} key={key}>
                        {lang.name} <CloseButton onClick={() => setSelected(selected.filter(it => it !== lang))}/>
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
                }} selected={selected} multiple={multiple} allowedLanguages={allowedLanguages}/>
            </DropdownMenu>
        </Dropdown>
    );
}

function FilteredLanguageList({selected, multiple, setSelected, filterProxy, allowedLanguages}) {
    const [languages, setLanguages] = useState([]);
    const [filter, setFilter] = useState("");
    filterProxy.m = setFilter;
    selected = selected || [];
    multiple = multiple || false;

    useEffect(() => {
        if (!allowedLanguages) {
            axios.get("/api/language/search", {
                params: {
                    filter: filter,
                    perPage: 20
                }
            }).then(resp => setLanguages(resp.data.content));
        } else {
            setLanguages(allowedLanguages.filter(t => t.name.includes(filter)));
        }
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

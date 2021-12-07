import React from "react";

export default function FancyCodeBlock({inline, className, children, ...props}) {
    return <code
        className={"bg-light border rounded-3 p-1 " + (!inline && "w-100 d-block") + (className || "")}
        children={children} {...props}/>
}
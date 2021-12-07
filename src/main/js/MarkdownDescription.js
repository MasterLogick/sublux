import ReactMarkdown from "react-markdown";
import React from "react";
import remarkGfm from "remark-gfm";
import {Table} from "react-bootstrap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {LightAsync as SyntaxHighlighter} from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

export {MarkdownDescription};

const MarkdownDescription = ({...props}) => {
    return (<ReactMarkdown
        remarkPlugins={[[remarkGfm, {singleTilde: false}], remarkMath]}
        rehypePlugins={[rehypeKatex]}
        skipHtml={true}
        components={{
            pre({node, className, ...props}) {
                return (<pre className={"w-100 " + (className || "")} {...props}/>);
            },
            code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || "");
                return (
                    !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={style}
                            language={match[1]}
                            PreTag="div"
                            className={"border rounded-2 " + (className || "")}
                            {...props}
                        />
                    ) : <code
                        className={"bg-light border rounded-3 p-1 " + (!inline && "w-100 d-block") + (className || "")}
                        children={children} {...props}/>);
            },
            table({node, ...props}) {
                return (<Table bordered {...props}/>);
            },
            blockquote({node, className, ...props}) {
                return (<div className={"w-100 bg-light p-2"}>
                    <blockquote className={"blockquote " + (className || "")}{...props}/>
                </div>)
            }
        }}
        disallowedElements={["h1"]}
        {...props}/>);
}
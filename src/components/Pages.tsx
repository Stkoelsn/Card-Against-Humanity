import { Button } from "./Common";
import React, { useState } from "react";
import { useLanguageContext, LanguageDef as ld } from "../core/Localization";
import { AnyMxRecord } from "dns";
import { ListData } from "react-stately";
import "../assets/table.css"

type SortModeProps = {
    identifier: string,
    caption: string,
    default: boolean,
    callback: (id: string) => void,

};

export function PageSortMode(props: SortModeProps) {
    return <React.Fragment />;
}

type PreambleProps = {
    children: JSX.Element[] | JSX.Element | void,
    onRefresh?: () => void | void,
    onReverse: () => void,
    buttonStyle: any;
    sortMode: string,
}

export function PagesPreamble(props: PreambleProps) {
    
    const language = useLanguageContext();
    ld.setLanguage(language);
    

    return (<div>
                    <div className="center">    
        <a className="table-heading-refresh">{ld.formatString(ld.sort)} {props.sortMode}</a></div>
        {props.onRefresh !== undefined ? <Button className={props.buttonStyle} onClick={() => {
            if (props.onRefresh !== undefined)
                props.onRefresh();
        }}>{ld.formatString(ld.refresh)}</Button> : <a/>}

        <Button className={props.buttonStyle} onClick={() => props.onReverse()}>{ld.formatString(ld.reverseSort)}</Button>


        {Array.isArray(props.children) ? props.children.map((c, key) =>
            <Button className={props.buttonStyle} key={key} onClick={() => c.props.callback(c.props.identifier)}>
                {c.props.caption}
            </Button>
        ) : <a />}
        
    </div>
    
    )
}

type PostambleProps = {
    onNext: () => void,
    onPrevious: () => void,
    onFirst: () => void,
    onLast: () => void,
    buttonStyle: any;
}

export function PagesPostamble(props: PostambleProps) {
    return (
        <div>
            <Button className={props.buttonStyle} onClick={props.onFirst}>
                {ld.formatString(ld.firstPage)}
            </Button>
            <Button className={props.buttonStyle} onClick={props.onPrevious}>
                {ld.formatString(ld.previousPage)}
            </Button>
            <Button className={props.buttonStyle} onClick={props.onNext}>
                {ld.formatString(ld.nextPage)}
            </Button>
            <Button className={props.buttonStyle} onClick={props.onLast}>
                {ld.formatString(ld.lastPage)}
            </Button>
        </div>);
}
import { useReducer, useState } from "react";
import usePageContext, { PageContainer, Page, usePages, useSortedMapping, useMapping, useCompareDevice } from '../core/Pages'

// stronghold for game data

type Player = {
    id: number,
    name: string
};

type Entry = {
  "id": number,
  "running": boolean,
  "players": Player [],
  "owner": Player,
  "winner": Player,
  "czar": Player,
  "packs": number[],
  "goal": number,
};

type SortCallback = (a: Entry, b: Entry) => number;
const SortMapping: { [key: string]: SortCallback } = {
    "sortrunning": useCompareDevice("running"),
    "reverse_sortrunning": useCompareDevice("running", true),
    "sortplayers": useCompareDevice((game: Entry) => game.players.length),
    "reverse_sortplayers": useCompareDevice((game: Entry) => game.players.length, true),
}

type State = {
    content: Entry[],
    pages: Page[],
    page: number,
    initialized: boolean,
    reverse: boolean,
    method: string,
};

type SortTypes = "sortrunning" | "sortplayers" | "sortname" | "nosort";
type NavTypes = "next" | "previous" | "begin" | "end";
type ControlTypes = "toggle" | "populate" | "invalidate";

type PopulateAction = {
    type: "populate";
    content: Entry[],
}
type Action = { type: SortTypes | NavTypes | ControlTypes } | PopulateAction;

const DefaultSort = "sortplayers";
const PageSize = 8;

function Reducer(
    state: State,
    action: Action
): State {

    var type: string = action.type;

    if (action.type === "populate") {
        const { content } = action as PopulateAction;
        state.content = content;
        type = state.method;
    } else if (action.type === "toggle") {
        state.reverse = !state.reverse;
        type = state.method;
    }

    const { content, reverse } = state;

    const pc = usePageContext(state as PageContainer);

    switch (type) {
        case "nosort":
            return {
                ...state,
                pages: usePages(useMapping(content), PageSize),
                page: 0
            }
        case "sortrunning":
        case "sortplayers":
            console.log(content);
            return {
                ...state,
                pages: usePages(useSortedMapping(content, SortMapping[`${reverse ? "reverse_" : ""}${type}`]), PageSize),
                page: 0
            };
        case "next":
            return { ...state, ...pc.next().unwrap()};
        case "previous":
            return { ...state, ...pc.previous().unwrap()};
        case "begin":
            return { ...state, ...pc.begin().unwrap()};
        case "end":
            return { ...state, ...pc.end().unwrap()};
        case "invalidate":
            return { ...state, initialized: false };
        default:
            console.log("unhandled " + type);
            return state;
    }
}

export default () => useReducer(Reducer, {
    content: [],
    pages: [],
    page: -1,
    initialized: false,
    reverse: false,
    method: DefaultSort,
})
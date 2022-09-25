import { useReducer } from "react";
import { isAssertEntry } from "typescript";
import usePageContext, 
{ 
    PageContainer, 
    Page, 
    usePages, 
    useSortedMapping, 
    useCompareDevice 
} from '../core/Pages'

type Entry = {
    id: number,
    name: string,
    best_cpm: number,
    best_score: number,
};

type Member = "id" | "name" | "best_cpm" | "best_score";

type State = {
    content: Entry[],
    pages: Page[],
    page: number,
    initialized: boolean,
    reverse: boolean,
    method: string,
};

type SortTypes = "sortcpm" | "sortscore" | "sortname" | "nosort";
type NavTypes = "next" | "previous" | "begin" | "end";
type ControlTypes = "toggle" | "populate" | "invalidate";

type PopulateAction = {
    type: "populate";
    content: Entry[],
}
type Action = { type: SortTypes | NavTypes | ControlTypes } | PopulateAction;

const DefaultSort = "sortscore";
const PageSize = 8;

type SortCallback = (a: Entry, b: Entry) => number;
const SortMapping: { [key: string]: SortCallback } = {
    "sortcpm": useCompareDevice("best_cpm"),
    "reverse_sortcpm": useCompareDevice("best_cpm", true),
    "sortscore": useCompareDevice("best_score"),
    "reverse_sortscore": useCompareDevice("best_score", true),
    "sortname": useCompareDevice("name", false, "string"),
    "reverse_sortname": useCompareDevice("name", true, "string"),
};

function Reducer(
    state: State,
    action: Action
): State {

    var type: string = action.type;

    if (action.type === "populate") {
        const { content } = action as PopulateAction;
        state.content = content;
        type = state.method;
        state.initialized = true;
    } else if (action.type === "toggle") {
        type = state.method;
        state.reverse = !state.reverse;
    }

    const { content, reverse } = state;

    const pc = usePageContext(state as PageContainer);

    switch (type) {
        case "sortscore":
        case "sortcpm":
        case "sortname":
            return {
                ...state,
                method: type,
                pages: usePages(useSortedMapping(content, SortMapping[`${reverse ? "reverse_" : ""}${type}`]), PageSize),
                page: 0,
            };
        case "nosort":
            return {
                ...state,
                method: type,
                pages: [],
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
            throw `leaderboard reducer unhandled action ${type}`;
    }
}

export default (nosort=false) => useReducer(Reducer, {
    content: [],
    pages: [],
    page: -1,
    initialized: false,
    reverse: false,
    method: nosort ? "nosort" : DefaultSort,
});

export function playerById(player_id: number, content: Entry[]): Entry | undefined {
    return content.find((entry) => entry.id === player_id);
}

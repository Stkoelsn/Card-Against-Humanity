import { useState, createContext, useContext, useReducer } from "react";
import usePageContext, { PageContainer, Page, usePages, useSortedMapping, useMapping, useCompareDevice } from '../core/Pages'

export type Whitecard = {
    id: number,
    text: string,
    pack: number,
}
export const EmptyWhitecard = { id: -1, text: "", pack: -1 };

export type Blackcard = {
    id: number,
    text: string,
    pack: number,
    pick: number,
}
export const EmptyBlackcard = { id: -1, text: "", pack: -1, pick: -1 };

export type Deck = {
    id: number,
    name: string,
    blackCardCount: number,
    whiteCardCount: number
    stronghold: DeckData
}

export type PackStronghold = {
    packs: Deck[],
    view: number,
    generation: number
};

const EmptyPackStronghold: PackStronghold = {
    packs: [],
    view: -1,
    generation: 0
};

export type DeckData = {
    id: number,
    name: string,
    white: Whitecard[],
    black: Blackcard[],
    official: boolean
}

const EmptyDeckData: DeckData = {
    id: -1,
    name: "invalid",
    white: [],
    black: [],
    official: false,
};

type ActionPopulate = {
    type: "populate",
    input: Deck[]
};

type ActionPopulateSingular = {
    type: "populate_single",
    input_wc: Whitecard[]
    input_bc: Blackcard[]
};

type ActionView = {
    type: "view",
    id: number
}

type Action = ActionPopulate | ActionPopulateSingular | ActionView;

function CreateDeckStronghold(deck: Deck, whiteCards: Whitecard[], blackCards: Blackcard[]): DeckData {
    if (whiteCards.findIndex(wc => wc.pack == deck.id) == -1 && blackCards.findIndex(bc => bc.pack == deck.id) == -1)
        return EmptyDeckData;
    return {
        id: deck.id,
        name: deck.name,
        white: whiteCards.filter(wc => wc.pack == deck.id),
        black: blackCards.filter(bc => bc.pack == deck.id),
        official: true,
    }
}

function StrongholdReducer(state: PackStronghold, action: Action): PackStronghold {

    var ret_obj = null;

    switch (action.type) {
        case "view":
            console.log("assigned view to " + action.id);
            ret_obj = {
                ...state,
                generation: state.generation + 1,
                view: action.id
            }
            break;
        case "populate":
            ret_obj = {
                ...state,
                generation: state.generation + 1,
                packs: action.input
            }
            break;
        case "populate_single":
            ret_obj = {
                ...state,
                generation: state.generation + 1,
                packs: state.packs.map(deck => {
                    return {
                        ...deck,
                        stronghold: CreateDeckStronghold(deck, action.input_wc, action.input_bc),
                    }
                })
            }
            break;
    }

    return ret_obj;
}

export class PackWrapper {
    stronghold: PackStronghold

    constructor(stronghold: PackStronghold) {
        this.stronghold = stronghold;
    }

    countCards(packIds: number[]): number[] { // 0: white card count, 1: black card count
        var whiteCards = 0, blackCards = 0;
        this.stronghold.packs.forEach(pack => {
            if (packIds.findIndex(id => pack.id == id) != -1) {
                whiteCards += pack.whiteCardCount;
                blackCards += pack.blackCardCount;
            }
        })
        return [whiteCards, blackCards];
    }

    getCards(packIds: number[]): Blackcard[][] {
        var whiteCards: Whitecard[] = [];
        var blackCards: Blackcard[] = [];
        this.stronghold.packs.forEach(pack => {
            if (packIds.findIndex(id => pack.id == id) != -1 &&
                pack.stronghold !== undefined) {
                whiteCards = whiteCards.concat(pack.stronghold.white);
                blackCards = blackCards.concat(pack.stronghold.black);
            }
        })
        return [whiteCards.map(wc => { return { ...wc, pick: -1 } }), blackCards]; // 3V1L
    }

    getCurrentCards(): Whitecard[] {
        if (this.stronghold.view === -1)
        {
            console.log("view is invalid");
            return [];
        }
        const pack = this.stronghold.packs.find(pack => pack.id == this.stronghold.view);
        if (pack === undefined || pack.stronghold === undefined)
        {
            console.log("stronghold of deck is invalid");
            return [];
        }
        return [pack.stronghold.black.map(blackcard => { return { id: blackcard.id, text: blackcard.text, pack: blackcard.pack}}),
                pack.stronghold.white].flat();
    }

    hasCurrentPackUpdated(): boolean {
        if (this.stronghold.view === -1)
        {
            return false;
        }
        const pack = this.stronghold.packs.find(pack => pack.id == this.stronghold.view);
        if (pack === undefined || pack.stronghold === undefined)
        {
            return false;
        }
        return true;
    }

    getCurrentDependences(): number[] {
        return [this.stronghold.view, this.stronghold.generation, this.hasCurrentPackUpdated() === true ? 1 : 0]
    }

    static formatBlackCard(blackcard: Blackcard, whitecard: Whitecard[]): Whitecard {
        if (blackcard.pick == whitecard.length)
            console.error("pack wrapper black card pick count does not match given white cards!");
        var output = blackcard.text;
        whitecard.forEach(card => output = output.replace("_", card.text));
        return {
            id: blackcard.id,
            text: output,
            pack: blackcard.pack,
        };
    }
}

//export const usePackStronghold = () => useState(EmptyPackStronghold);
export const usePackStronghold = () => useReducer(StrongholdReducer, EmptyPackStronghold);
export const PackContext = createContext<PackStronghold>(EmptyPackStronghold);
export const usePackContext = () => useContext(PackContext);
export const usePackWrapper = (pack: PackStronghold) => new PackWrapper(pack)
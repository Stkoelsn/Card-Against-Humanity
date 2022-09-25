import { useReducer, createContext, useContext } from "react";
import internal from "stream";
import { createVoidZero } from "typescript";
import usePageContext, { PageContainer, Page, usePages, useSortedMapping, useMapping, useCompareDevice } from '../core/Pages'
import { EmptyBlackcard, PackWrapper, Blackcard, Whitecard, Deck } from "./Decks";

// stronghold for game data

export type Player = {
    id: number,
    name: string,
}

export const EmptyPlayer = { id: -1, name: "" };

type Czar = Player;

type GameState = {
    currentBlackCard: Blackcard,
    points: number[],
    waitingForPlayers: number,
}

const EmptyGameState: GameState = {
    currentBlackCard: EmptyBlackcard,
    points: [],
    waitingForPlayers: -1
};

type MetaState = {
    id: number,
    czar: Czar,
    running: boolean,
    players: Player[],
    owner: Player,
    winner: Player,
    packs: number[],
    goal: number
};

const EmptyMetaState: MetaState = {
    id: -1,
    czar: { id: -1, name: "" },
    running: false,
    players: [],
    owner: EmptyPlayer,
    winner: EmptyPlayer,
    packs: [],
    goal: 0
}

type PackState = {
    packIds: number[],
    blackCards: Blackcard[],
    whiteCards: Whitecard[],
}

const EmptyPackState: PackState = {
    packIds: [],
    blackCards: [],
    whiteCards: [],
};

type OptionChoice = {
    option: number,
    choice: Whitecard,
};

type DisplayState = {
    players: Page[],
    playerPage: number,
    packs: Page[],
    packPage: number,

    choices: OptionChoice[],
    options: number[],
    localCards: Whitecard[],
    placedCards: Whitecard[][],
};

const EmptyDisplayState: DisplayState = {
    players: [],
    playerPage: -1,
    packs: [],
    packPage: -1,
    choices: [],
    options: [],
    localCards: [],
    placedCards: [],
};

export type Stronghold = {
    game: GameState,
    meta: MetaState,
    packs: PackState,
    display: DisplayState,
    active: boolean
};

const EmptyStronghold: Stronghold = { active: false, game: EmptyGameState, meta: EmptyMetaState, packs: EmptyPackState, display: EmptyDisplayState };

type PollAction = {
    type: "poll",
    czar: Player,
    currentBlackCard: Blackcard,
    points: number[],
    waitingForPlayers: number
}

type HandsAction = {
    type: "hands",
    input: Whitecard[]
};

type WakeupAction = {
    type: "wakeup",
    input: MetaState
};

type PlayerPollAction = {
    type: "ppoll",
    player: Player,
    whitecards: Whitecard[]
};

type PickAction = {
    type: "pick",
    option: number,
    card: Whitecard
};

type ResetPickAction = {
    type: "reset_pick"
};

type Action = PlayerPollAction | WakeupAction | PollAction | HandsAction | PickAction | ResetPickAction;

function BuildDisplay(stronghold: Stronghold): DisplayState {
    return stronghold.display;
    return {
        ...stronghold.display,
        placedCards: stronghold.meta.players.map(() => [])
    }
}

function BuildPacks(packIds: number[], stronghold: Stronghold, decks: Deck[])
{
    const filtered = decks.filter(deck => packIds.find(id => deck.id == id) !== undefined);
    console.log("filtered packs...")
    console.log(filtered);
    let emptyWC: Whitecard[] = [];
    let emptyBC: Blackcard[] = [];

    return {
        packIds: packIds,
        whiteCards: emptyWC.concat.apply(emptyWC, filtered.map(entries => entries.stronghold === undefined ? [] : entries.stronghold.white)),
        blackCards: emptyBC.concat.apply(emptyBC, filtered.map(entries => entries.stronghold === undefined ? [] : entries.stronghold.black)),
    }
}

function StrongholdReducer(state: Stronghold,
    action: Action) {

    var ret_obj = null;
    switch (action.type) {
        case "ppoll": 
        if (state.display.placedCards.length == state.meta.players.length)
            console.error("game stronghold player poll placed cards invalid");
        ret_obj = {
            ...state,
            display: {
                ...state.display,
                placedCards: state.display.placedCards.splice(state.meta.players.indexOf(action.player), 1, action.whitecards)
            }
        }
        break;
        case "reset_pick":
            ret_obj = {
                ...state,
                display: {
                    ...state.display,
                    choices: [],
                    options: state.display.options.splice(0, 0, ...state.display.choices.map((c) => c.option)),
                    localCards: state.display.localCards.splice(0, 0, ...state.display.choices.map((c) => c.choice))
                }
            }
            break;
        case "pick":
            ret_obj = {
                ...state,
                display: {
                    ...state.display,
                    choices: state.display.choices.splice(0, 0, {
                        option: action.option,
                        choice: action.card
                    }),
                    options: state.display.options.splice(
                        state.display.options.indexOf(action.option),
                        1
                    ),
                    localCards: state.display.localCards.splice(
                        state.display.localCards.indexOf(action.card),
                        1
                    ),
                }
            };
            break;
        case "wakeup":
            console.log("wakeup");
            console.log(action);
            ret_obj = {
                ...state,
                meta: { ...state.meta, ...action.input },
            };
            console.log(ret_obj.meta.id);
            break;
        case "poll":
            ret_obj = {
                ...state,
                game: {
                    ...state.game,
                    currentBlackCard: action.currentBlackCard,
                    points: action.points,
                    waitingForPlayers: action.waitingForPlayers
                },
                meta: {
                    ...state.meta,
                    czar: action.czar
                }
            };
            break;
        case "hands":
            ret_obj = {
                ...state,
                display: {
                    ...state.display,
                    localCards: action.input,
                }
            };
            break;
    }
    return {
        ...ret_obj,
        display: BuildDisplay(ret_obj),
    }
}

class GameWrapper {
    state: Stronghold;

    constructor(stronghold: Stronghold) {
        this.state = stronghold;
    }

    getPlayerScore(player: Player): number {
        return this.state.game.points[this.state.meta.players.findIndex((element) => element.id == player.id)];
    }

    getPlayerCapacities(whiteCards: number): number[] {
        console.log("white cards " + whiteCards);
        return [Math.floor(whiteCards / 10) - 1, this.state.meta.players.length ]; 
    }

    getPlayers(): Player[] {
        return this.state.meta.players.sort((a, b) => {
            const indexOfA = this.state.meta.players.indexOf(a);
            const indexOfB = this.state.meta.players.indexOf(b);
            return this.state.game.points[indexOfA] - this.state.game.points[indexOfB];
        });
    }

    getPlayerDependencies(): string[] {
        return this.state.game.points.join().split("");
    }

    getLocalWhiteCards(): Whitecard[] {
        return this.state.display.localCards.sort((a, b) => a.id - b.id);
    }

    getLocalWhiteCardDependencies(): number[] {
        return [this.state.display.options.length, this.state.display.localCards.length];
    }

    getPlacedWhiteCards(): Whitecard[] {
        let blackcard = this.state.game.currentBlackCard;
        return this.state.meta.players.map((_, index) => PackWrapper.formatBlackCard(blackcard, this.state.display.placedCards[index]));
    }

    getPlacedWhiteCardDependencies(): number[] {
        return this.state.display.placedCards.map(arr => arr.length);
    }

    getCards(type: "localCards" | "placedCards"): Whitecard[]
    {
        switch (type) {
            default:
            case "localCards":
            return this.getLocalWhiteCards();
            case "placedCards":
            return this.getPlacedWhiteCards();
        }
    }

    getCardDependencies(type: string): number[] {
        switch (type) {
            default:
            case "local":
            return this.getLocalWhiteCardDependencies();
            case "placed":
            return this.getPlacedWhiteCardDependencies();
        }
    }
}

export default () => useReducer(StrongholdReducer, EmptyStronghold);
export const GameContext = createContext<Stronghold>(EmptyStronghold);
export const useGameContext = () => useContext(GameContext);
export const useGameWrapper = (game: Stronghold) => new GameWrapper(game);
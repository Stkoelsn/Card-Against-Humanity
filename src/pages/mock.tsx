import React, { useState, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Cell, Column, Row, TableBody, TableHeader } from "react-stately";
import { Table } from "../components/Table";
import { usePackContext } from "../app/Decks";
import Game, { Player, Stronghold, GameContext } from "../app/Game";
import {Ingame , Lobby } from "./Game";
import { useLanguageContext, LanguageDef as ld } from "../core/Localization";
import {
  usePages,
  useSortedMapping,
  useMapper,
  useCompareDevice,
} from "../core/Pages";
import { Numeric, Button } from "../components/Common";
import "../assets/table.css";
import { isReturnStatement } from "typescript";



function mockGameState(): Stronghold {
  const EmptyPlayer = { id: -1, name: "" };
  const EmptyBlackcard = { id: -1, text: "", pack: -1, pick: -1 };
  const BMockCard1 = {id:1, text:"1", pack: 1, pick:1};
  const BMockCard2 = {id:1, text:"lorem Ipsum und so _", pack: 1, pick:3};
  const WMockCard1 = {id:1, text:"Ipsum Lorem und so", pack: 1};
  const WMockCard2 = {id:1, text:"1", pack: 1};
  const WMockCard3 = {id:1, text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ", pack: 1};
  const Player1 = {
    id: 1,
    name: "Domenic",
}
const Player2 = {
    id: 2,
    name: "Domenique",
}
const Player3 = {
  id: 3,
  name: "dominiscus",
}
const Player4 = {
  id: 4,
  name: "Domenique",
}
const Player5 = {
  id: 5,
  name: "domreq",
}
const Player6 = {
  id: 6,
  name: "Domeniquirium",
}
const Player7 = {
  id: 7,
  name: "Domeniques",
}
const cards = [WMockCard1,WMockCard2,WMockCard1, WMockCard2, WMockCard3, WMockCard1,WMockCard2,WMockCard1, WMockCard2, WMockCard3];
  const Stronghold: Stronghold = {
    active: false,
    game: {
      currentBlackCard: BMockCard2,
      points: [1,2,3,0,5,2,7],
      waitingForPlayers: -1,
    },
    meta: {
      id: 1,
      czar: { id: -1, name: "stkoelsn" },
      running: true,
      players: [Player1, Player2, Player3, Player4, Player5, Player6, Player7,],
      owner: Player3,
      winner: EmptyPlayer,
      packs: [],
      goal: 20,
    },
    packs: {
      packIds: [4,2,0],
      blackCards: [BMockCard1, BMockCard2],
      whiteCards: [WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,
        WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,WMockCard1,WMockCard2,],
    },
    display: {
      players: [],
      playerPage: -1,
      packs: [],
      packPage: -1,
      choices: [],
      options: [1, 2],
      localCards: cards, 
      placedCards: cards.map(() => cards)
    },
  };

  return Stronghold;
}


export function GameNode() {

    const game = mockGameState();

    
  return <GameContext.Provider  value={game}> 
   <Outlet/>

        

      </GameContext.Provider>;
}

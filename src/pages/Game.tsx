import React, { useState, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Cell, Column, Row, TableBody, TableHeader } from "react-stately";
import { Table } from "../components/Table";
import { usePackContext, usePackWrapper, Whitecard } from "../app/Decks";
import Game, { Player, useGameWrapper } from "../app/Game";
import { useLanguageContext, LanguageDef as ld } from "../core/Localization";
import {
  usePages,
  useSortedMapping,
  useMapper,
  useCompareDevice,
} from "../core/Pages";
import { Numeric, Button } from "../components/Common";
import { useGameContext } from "../app/Game";
import { useUserContext } from "../app/User";
import "../assets/table.css";

type LobbyProps = {
  onStart: (goal: number) => void;
};

export function Lobby(props: LobbyProps) {
  const game = useGameContext();
  const pack = usePackContext();
  const user = useUserContext();
  const wrapper = useGameWrapper(game);
  const packWrapper = usePackWrapper(pack);

  const [whiteCards, _] = packWrapper.countCards(game.meta.packs);
  const [maxPlayerCount, playerCount] = wrapper.getPlayerCapacities(whiteCards);

  const isOwner = game.meta.owner.id === user.userId;
  const canStart = isOwner && playerCount > 2;

  const startGame = () => props.onStart(game.meta.goal);

  return (
    <div className="table_box">
      <div className="lobbyText">
        {ld.formatString(ld.gameOwnerIs)}
        {game.meta.owner.name}
      </div>

      <div className="lobbyText">
        {ld.formatString(ld.status)}{" "}
        {game.meta.running
          ? ld.formatString(ld.gameRunning)
          : ld.formatString(ld.gameNotRunning)}
      </div>
      <div className="lobbyText">
        {ld.formatString(ld.maxPlayerCount)} {playerCount} / {maxPlayerCount}
      </div>
      <div className="leaderboard">
        <Table>
          <TableHeader>
            <Column>
              <a className="table-head">{ld.formatString(ld.name)}</a>
            </Column>
            <Column>
              <a className="table-head">{ld.formatString(ld.score)}</a>
            </Column>
          </TableHeader>
          <TableBody>
            {game.meta.players.map((player, key) => (
              <Row key={key}>
                <Cell>
                  <a className="table-text-Game">{player.name}</a>
                </Cell>
                <Cell>
                  <a className="table-text-Count">
                    {wrapper.getPlayerScore(player)}
                  </a>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>
      <span className="lobbyText">
        {ld.formatString(ld.setGoal)} : {game.meta.goal}{" "}
      </span>
      {canStart && (
        <button onClick={startGame}>{ld.formatString(ld.start)}</button>
      )}
    </div>
  );
}

type CardListProp = {
  targetList: "placedCards" | "localCards";
  showOptions: boolean;
  onOption: (num: number, card: Whitecard) => void;
};

type CardListProps = Omit<CardListProp, "onOption"> &
  Partial<Pick<CardListProp, "onOption">>;

function CardsList(props: CardListProps) {
  const game = useGameContext();
  const wrapper = useGameWrapper(game);
  const cards = wrapper.getCards(props.targetList);

  const onOption = (num: number, card: Whitecard) => {
    if (props.showOptions && props.onOption !== undefined) {
      props.onOption(num, card);
      console.log("option was " + num);
    }
  };

  return (
    <div className="table_host_Vert">
      {cards.map((card, id) => (
        <div className="card">
          <div className="cardTextContainer">
            <div className="cardText">{card.text}</div>
          </div>
          <div className="cardButtonContainer">
            {props.showOptions &&
              game.display.options.map((num) => (
                <button
                  key={num}
                  className="cardButton"
                  onClick={() => onOption(num, card)}
                >
                  {num}
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Blackcard(props: any) {
  const game = useGameContext();

  return <div className="blackCard">{game.game.currentBlackCard.text}</div>;
}

type IngameProps = {
  onOption: (num: number, card: Whitecard) => void;
  onConfirm: (cardIds: number[]) => void;
  onReset: () => void;
};

type Input = {
  option: number;
  card: Whitecard;
};

const EmptyInputs: Input[] = [];

export function Ingame(props: IngameProps) {
  const [inputs, setInputs] = useState(EmptyInputs);
  const game = useGameContext();
  const wrapper = useGameWrapper(game);
  const user = useUserContext();

  const pickCount = game.game.currentBlackCard.pick;
  const players = useMemo(
    () => wrapper.getPlayers(),
    wrapper.getPlayerDependencies()
  );

  const onOption = (num: number, card: Whitecard) => {
    setInputs(
      inputs.splice(0, 0, {
        option: num,
        card: card,
      })
    );
    props.onOption(num, card);
  };

  const onConfirm = () => {
    props.onConfirm(
      inputs.sort((a, b) => a.option - b.option).map((x) => x.card.id)
    );
  };

  return (
    <div className="table_box">

      <div>
      <div className="topBracket">
        <Blackcard>
          <h1>{game.game.currentBlackCard.text}</h1>
        </Blackcard>
        <div className="infoBracket">
          <div className="metaInfo">
            {ld.formatString(ld.czar)}
            {game.meta.czar.name}
          </div>
          <div className="metaInfo">
            {ld.formatString(ld.waitingPlayers)}
            {game.game.waitingForPlayers}
          </div>
          <div className="metaInfo">
            {ld.formatString(ld.goal)}: {game.meta.goal}
          </div>
        </div>
        <div className="leaderbord">
          <Table>
            <TableHeader>
              <Column>
                <a className="table-head-L">{ld.formatString(ld.name)}</a>
              </Column>
              <Column>
                <a className="table-head-L">{ld.formatString(ld.score)}</a>
              </Column>
            </TableHeader>
            <TableBody>
              {players.map((player, key) => (
                <Row key={key}>
                  <Cell>
                    <a className="table-text-name">{player.name}</a>
                  </Cell>
                  <Cell>
                    <a className="table-text-Count">
                      {wrapper.getPlayerScore(player)}
                    </a>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>


      <div>
        <CardsList targetList="placedCards" showOptions={false} />
        <CardsList
          targetList="localCards"
          showOptions={true}
          onOption={onOption}
        />
      </div>
      <button className="table-button-bottom-2" onClick={onConfirm}>
        {ld.formatString(ld.confirmOptions)}
      </button>
      <button className="table-button-bottom-2" onClick={props.onReset}>
        {ld.formatString(ld.resetOptions)}
      </button>
    </div>
  );
}

export function Players() {
  return <h1>foo</h1>;
}

export function Packs() {
  return <h1>bar</h1>;
}

type CreateGameProps = {
  onCreate: (cardPackIds: number[], goalAmount: number) => void;
};

export function Create(props: CreateGameProps) {
  let navigate = useNavigate();
  const packs = usePackContext();
  const language = useLanguageContext();
  const [selectedPacks, setSelectedPacks] = useState([]);
  const [goal, setGoal] = useState(0);
  ld.setLanguage(language);

  const createHook = (packs: number[], goal: number) => {
    console.log("hook started");
    if (packs.length > 0 && goal > 0) {
      console.log("requirements valid");
      props.onCreate(packs, goal); // api does not get sent twice, waits for the server
      navigate("/game/lobby");
    } else {
      console.log("requirements invalid");
    }
  };

  return (
    <div className="table_box">
      <div className="center">
        <a className="table-heading-refresh">
          {ld.formatString(ld.selectCardpacks)}
        </a>
      </div>
      <hr />
      <div className="table_host">
        <Table
          aria-label="Table with selection"
          selectionMode="multiple"
          selectedKeys={selectedPacks}
          onSelectionChange={setSelectedPacks}
        >
          <TableHeader>
            <Column>
              <div className="left">
                <a className="table-head">{ld.formatString(ld.packname)}</a>{" "}
              </div>
            </Column>
            <Column>
              <a className="table-head-R">{ld.formatString(ld.sortWhite)}</a>
            </Column>
            <Column>
              <a className="table-head-R">{ld.formatString(ld.sortBlack)}</a>
            </Column>
          </TableHeader>
          <TableBody>
            {packs.packs.map((pack, i) => (
              <Row key={i}>
                <Cell>
                  <a className="table-text-long">{pack.name}</a>
                </Cell>
                <Cell>
                  <a className="table-text-Count">{pack.whiteCardCount}</a>
                </Cell>
                <Cell>
                  <a className="table-text-Count">{pack.blackCardCount}</a>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>
      <hr />
      <div className="center">
        <a className="table-head">
          {ld.formatString(ld.setGoal)}
          <div className="center">
            <Numeric value={goal} onChange={setGoal} />{" "}
          </div>
        </a>
      </div>
      <hr />
      <Button
        className="bigButton"
        onClick={() => {
          createHook(Array.from(selectedPacks), goal);
        }}
      >
        {ld.formatString(ld.confirm)}
      </Button>
    </div>
  );
}

export function GameNode() {
  return <Outlet />;
}

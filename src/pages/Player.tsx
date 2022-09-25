import React, { useState, useMemo } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Cell, Column, Row, TableBody, TableHeader } from "react-stately";
import { RequirementsOk, checkUserName } from "../app/User";
import {
  useLanguageContext,
  LanguageDef as ld,
  localizeId,
} from "../core/Localization";
import {
  usePages,
  useSortedMapping,
  useUnmapper,
  useCompareDevice,
} from "../core/Pages";
import {
  PagesPostamble,
  PagesPreamble,
  PageSortMode,
} from "../components/Pages";
import { Table } from "../components/Table";
import useGames from "../app/Games";
import "../assets/log.css";
import "../assets/table.css";
import { Button } from "../components/Common";

export function PlayerNode() {
  return <Outlet />;
}

type CreateEvent = (userName: string) => boolean;
type CreateProps = {
  onCreate: CreateEvent;
};

export function Create(props: CreateProps) {
  let navigate = useNavigate();

  const language = useLanguageContext();
  ld.setLanguage(language);

  const [userName, setUserName] = useState("");
  const [requirements, setRequirements] = useState(RequirementsOk);

  const registerHook = (username: string) => {
    console.log("hook started");
    const newRequirements = checkUserName(username);
    if (newRequirements.valid) {
      console.log("requirements valid");
      props.onCreate(username);
      navigate("/public");
    } else {
      console.log("requirements invalid");
      setRequirements(newRequirements);
      console.log(newRequirements);
    }
  };

  return (
    <div className="log_box">
      <label className="log_text">{ld.formatString(ld.username)}</label>
      <br />
      <input
        className="log_input"
        id="username"
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
      />
      <br />
      <button className="log_button" onClick={() => registerHook(userName)}>
        {ld.formatString(ld.register)}
      </button>
      <br />
      <div>
        {requirements.messages.map((msg: string, i) => (
          <label key={i} className="log_error">
            {localizeId(language, msg)}
            <br />
          </label>
        ))}
      </div>
    </div>
  );
}

type DestroyUpdate = () => void;
type DestroyProps = {
  onDestroy: DestroyUpdate;
  onCancel: DestroyUpdate;
};

export function Destroy(props: DestroyProps) {
  const language = useLanguageContext();
  ld.setLanguage(language);
  return (
    <div className="log_box">
      <label className="log_text">{ld.formatString(ld.confirmDelete)}</label>
      <br />
      <Link to="/login">
        <button className="log_button" onClick={() => props.onDestroy()}>
          {ld.formatString(ld.logout)}
        </button>
      </Link>
      <Link to="/games">
        <button className="log_button" onClick={() => props.onCancel()}>
          {ld.formatString(ld.cancel)}
        </button>
      </Link>
      <br />
    </div>
  );
}

type PlayProps = {
  onGet: (callback: (games: any) => void) => any;
  onJoin: (game_id: number, goal: number, select: number[]) => void;
};

export function Play(props: PlayProps) {
  let navigate = useNavigate();
  const language = useLanguageContext();
  ld.setLanguage(language);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("name");
  const [reverse, setReverse] = useState(false);
  const [games, dispatch_games] = useGames();
  const [isFetched, setIsFetched] = useState(false);
  let pages = useMemo(
    () =>
      usePages(
        useSortedMapping(games.pages, useCompareDevice(sort, reverse)),
        10
      ),
    [games, sort, reverse]
  );

  if (isFetched === false) {
    props.onGet((games: any) =>
      dispatch_games({ type: "populate", content: games })
    );
    setIsFetched(true);
  }
  console.log(page)
  const unmapper = useUnmapper(games.content);
  const data = React.useMemo(
    () =>
      games.pages.length > 0
        ? games.pages[page].indices.map((page_entry: number) => {
            const entry = unmapper(page_entry);
            const players = entry["players"];
            return {
              ...entry,
              player_count: entry["players"].length,
              player_names: players.map((player) => player.name),
              owner_name: entry["owner"]["name"],
            };
          })
        : [],
    [games.page, games.pages.length]
  );

  const joinHook = (id: number, goal: number, packs: number[]) => {
    props.onJoin(id, goal, packs);
    navigate("/game/lobby");
  };

  return (
    <div className="table_box">
      <PagesPreamble
        sortMode={sort}
        buttonStyle="table-button-bottom-3"
        onReverse={() => setReverse(reverse ? false : true)}
      >
        <PageSortMode
          identifier="name"
          caption={ld.formatString(ld.gamesSortRunning).toString()}
          callback={() => setSort("gamesSortRunning")}
          default={true}
        />
        <PageSortMode
          identifier="white"
          caption={ld.formatString(ld.gamesSortPlayers).toString()}
          callback={() => setSort("gamesSortPlayers")}
          default={false}
        />
      </PagesPreamble>

      <div className="table-Inside">
        <Table aria-label="Table with selection">
          <TableHeader>
            <Column>
              <a className="table-head-Games">
                {ld.formatString(ld.gameIsRunning)}
              </a>
            </Column>
            <Column>
              <a className="table-head-Games">
                {ld.formatString(ld.gameOwner)}
              </a>
            </Column>
            <Column>
              <a className="table-head-Games">
                {ld.formatString(ld.gameParticipants)}
              </a>
            </Column>
            <Column>
              <a className="table-head-Games">{ld.formatString(ld.join)}</a>
            </Column>
          </TableHeader>
          <TableBody>
            {data.map((game) => (
              <Row key={game.id}>
                <Cell>
                  <a className="table-text-Game">
                    {game.running
                      ? ld.formatString(ld.running)
                      : ld.formatString(ld.waiting)}
                  </a>
                </Cell>
                <Cell>
                  <a className="table-text-Game">{game.owner.name}</a>
                </Cell>
                <Cell>
                  <a className="table-text-Game">{game.player_count}</a>
                </Cell>
                <Cell>
                  <Button
                    className="joinButton"
                    onClick={() => joinHook(game.id, game.goal, game.packs)}
                  >
                    {ld.formatString(ld.join)}
                  </Button>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>
      <PagesPostamble
        buttonStyle={"table-button-bottom"}
        onNext={() => setPage(Math.min(pages.length - 1, page + 1))}
        onPrevious={() => setPage(Math.max(0, page - 1))}
        onFirst={() => setPage(0)}
        onLast={() => setPage(pages.length - 1)}
      />
    </div>
  );
}

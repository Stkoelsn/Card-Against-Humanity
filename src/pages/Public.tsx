import React, { useState, useMemo } from "react";
import { useLanguageContext, LanguageDef as ld } from "../core/Localization";
import { Outlet, useNavigate } from "react-router-dom";
import { Cell, Column, Row, TableBody, TableHeader } from "react-stately";
import { Table } from "../components/Table";
import { usePackContext, usePackWrapper } from "../app/Decks";
import {
  usePages,
  useMapper,
  useSortedMapping,
  useCompareDevice,
} from "../core/Pages";
import {
  PagesPostamble,
  PagesPreamble,
  PageSortMode,
} from "../components/Pages";
import "../assets/table.css";
import "../assets/home.css";
import { Button } from "../components/Common";

type RenderTutorialPage = "basics" | "createGame" | "joinGame" | "ingame";
type RenderTutorialProp = {
  page: RenderTutorialPage;
};

function RenderTutorial(props: RenderTutorialProp) {
  switch (props.page) {
    case "basics":
      return (
        <div className="infoBox">
          <div className="topBracket">
            <div className="textExaplin">
              {ld.formatString(ld.basicInfo1)}
              <br />
              {ld.formatString(ld.basicInfo2)}
              <br />
              {ld.formatString(ld.basicInfo3)}
              <br />
              {ld.formatString(ld.basicInfo4)}
            </div>
          </div>
          <div className="infoBracketsss">
            <div className="leftBracket">
              {" "}
              <div className="pictureMenu"></div>{" "}
            </div>
            <div className="rightBracket">
              {" "}
              <div className="pictureMenu2"></div>{" "}
            </div>
          </div>
        </div>
      );
    case "createGame":
      return (
        <div className="infoBox">
          <div className="topBracket">
            <div className="textExaplin">
              {ld.formatString(ld.createGameInfo1)}
              <br />
              {ld.formatString(ld.createGameInfo2)}
              <br />
              {ld.formatString(ld.createGameInfo3)}
              <br />
              {ld.formatString(ld.createGameInfo4)}
            </div>
          </div>
          <div className="infoBracketsss">
            <div className="pictureCreateGame"></div>
          </div>
        </div>
      );
    case "joinGame":
      return (
        <div className="infoBox">
          <div className="topBracket">
            <div className="textExaplin">
              {ld.formatString(ld.joinGameInfo1)}
              <br />
              {ld.formatString(ld.joinGameInfo2)}
              <br />
              {ld.formatString(ld.joinGameInfo3)}
            </div>
          </div>
          <div className="infoBracketsss">
            <div className="pictureJoinGame"></div>
          </div>
        </div>
      );
    case "ingame":
      return (
        <div className="infoBox">
          <div className="topBracket">
            <div className="textExaplin">
              {ld.formatString(ld.ingameInfo1)}
              <br />
              {ld.formatString(ld.ingameInfo2)}
              <br />
              {ld.formatString(ld.ingameInfo3)}
            </div>
          </div>
          <div className="infoBracketsss">
            <div className="pictureIngame"></div>

            <div className="topBracket">
              <div className="textExaplin">
                {ld.formatString(ld.ingameInfo4)}
                <br />
                {ld.formatString(ld.ingameInfo5)}
                <br />
                {ld.formatString(ld.ingameInfo6)}
                <br />
                {ld.formatString(ld.ingameInfo7)}
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return <div />
  }
}

export function Home(this: any) {
  const language = useLanguageContext();
  ld.setLanguage(language);
  const [tutorial, setTutorial] = useState<RenderTutorialPage>("basics");

  return (
    <div>
      <label className="menüpfeil">
        {"<----- " + ld.formatString(ld.menu)}
      </label>
      <br></br>

      <div className="tutorialBox">
        <button
          className="topButton"
          onClick={() => {
            setTutorial("basics");
          }}
        >
          {ld.formatString(ld.basics)}
        </button>
        <button
          className="topButton"
          onClick={() => {
            setTutorial("createGame");
          }}
        >
          {ld.formatString(ld.createGame)}
        </button>
        <button
          className="topButton"
          onClick={() => {
            setTutorial("joinGame");
          }}
        >
          {ld.formatString(ld.joinGame)}
        </button>
        <button
          className="topButton"
          onClick={() => {
            setTutorial("ingame");
          }}
        >
          {ld.formatString(ld.ingame)}
        </button>

        <RenderTutorial page={tutorial}/>
      </div>
    </div>
  );
}

export function About() {
  const language = useLanguageContext();
  ld.setLanguage(language);
  return (
    <div className="log_box">
      <label className="table-text">{ld.formatString(ld.aboutCreator)}</label>
      <br />
      <label className="table-text">{ld.formatString(ld.aboutIssuers)}</label>
      <br />
      <label className="table-text">{ld.formatString(ld.aboutInstitute)}</label>
      <br />
    </div>
  );
}

export function Pack() {
  const packs = usePackContext();
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("name");
  const [reverse, setReverse] = useState(false);
  const language = useLanguageContext();
  ld.setLanguage(language);

  //let pages = useMemo(() => usePages(useMapping(packs.packs), 10), [packs, sort]);
  const wrapper = usePackWrapper(packs);
  console.log("view is " + packs.view);
  console.log("generation is " + packs.generation);

  let content = useMemo(
    () => wrapper.getCurrentCards(),
    wrapper.getCurrentDependences()
  );
    
  let pages = useMemo(
    () =>
      usePages(
        useSortedMapping(content, useCompareDevice(sort, reverse)),
        10
      ),
    [sort, reverse]
  );

  return (
    <div className="table_box">
      <PagesPreamble
        sortMode={sort}
        buttonStyle="table-button-bottom"
        onReverse={() => setReverse(reverse ? false : true)}
      >
        <PageSortMode
          identifier="name"
          caption={ld.formatString(ld.sortName).toString()}
          callback={() => setSort("name")}
          default={true}
        />
        <PageSortMode
          identifier="white"
          caption={ld.formatString(ld.sortWhite).toString()}
          callback={() => setSort("whiteCardCount")}
          default={false}
        />
        <PageSortMode
          identifier="black"
          caption={ld.formatString(ld.sortBlack).toString()}
          callback={() => setSort("blackCardCount")}
          default={false}
        />
      </PagesPreamble>
      <div className="table-Inside">
        <Table aria-label="Table with selection">
          <TableHeader>
            <Column>
              <div className="left">
                <a className="table-head">{ld.formatString(ld.packname)}</a>
              </div>
            </Column>
            <Column>
              <a className="table-head-R">{ld.formatString(ld.sortWhite)}</a>
            </Column>
          </TableHeader>
          <TableBody>
            {useMapper(
              content,
              { pages: pages, page: page },
              (pack, key) => (
                <Row key={key}>
                  <Cell>
                    <a className="table-text-long">{pack.id}:{pack.pack}</a>
                  </Cell>
                  <Cell>
                    <a className="table-text-Count">{pack.text}</a>
                  </Cell>
                </Row>
              )
            )}
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

type PacksProps = {
  onView: (id: number) => void,
}

export function Packs(props: PacksProps) {
  let navigate = useNavigate();
  const packs = usePackContext();
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("name");
  const [reverse, setReverse] = useState(false);
  const language = useLanguageContext();
  ld.setLanguage(language);

  //let pages = useMemo(() => usePages(useMapping(packs.packs), 10), [packs, sort]);
  let pages = useMemo(
    () =>
      usePages(
        useSortedMapping(packs.packs, useCompareDevice(sort, reverse)),
        10
      ),
    [packs, sort, reverse]
  );

  const viewHook = (id: number) => {
    props.onView(id);
    navigate("/public/packs/view");
  }

  return (
    <div className="table_box">
      <PagesPreamble
        sortMode={sort}
        buttonStyle="table-button-bottom"
        onReverse={() => setReverse(reverse ? false : true)}
      >
        <PageSortMode
          identifier="name"
          caption={ld.formatString(ld.sortName).toString()}
          callback={() => setSort("name")}
          default={true}
        />
        <PageSortMode
          identifier="white"
          caption={ld.formatString(ld.sortWhite).toString()}
          callback={() => setSort("whiteCardCount")}
          default={false}
        />
        <PageSortMode
          identifier="black"
          caption={ld.formatString(ld.sortBlack).toString()}
          callback={() => setSort("blackCardCount")}
          default={false}
        />
      </PagesPreamble>
      <div className="tableInsidePacks">
        <Table aria-label="Table with selection">
          <TableHeader>
            <Column>
              <div className="left">
                <a className="table-head">{ld.formatString(ld.packname)}</a>
              </div>
            </Column>
            <Column>
              <a className="table-head-R">{ld.formatString(ld.sortWhite)}</a>
            </Column>
            <Column>
              <a className="table-head-R">{ld.formatString(ld.sortBlack)}</a>
            </Column>
            <Column>
              <a className="table-head-R">{ld.formatString(ld.viewPack)}</a>
            </Column>
          </TableHeader>
          <TableBody>
            {useMapper(
              packs.packs,
              { pages: pages, page: page },
              (pack, key) => (
                <Row key={key}>
                  <Cell>
                    <a className="table-text-long">{pack.name}</a>
                  </Cell>
                  <Cell>
                    <a className="table-text-Count">{pack.whiteCardCount}</a>
                  </Cell>
                  <Cell>
                    <a className="table-text-Count">{pack.blackCardCount}</a>
                  </Cell>
                  <Cell>
                    <Button className="displayButton" onClick={() => viewHook(pack.id)}>
                      {ld.formatString(ld.viewPack)}
                    </Button>
                  </Cell>
                </Row>
              )
            )}
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

export function PublicNode() {
  return <Outlet />;
}

export function PackNode() {
  return <Outlet />;
}

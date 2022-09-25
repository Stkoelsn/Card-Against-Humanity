import React, { useState, useEffect, ComponentProps, FC } from 'react'
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Cfg from './app/Config';
import { UserContext, loadUser, saveUser, Guest, clearUser } from "./app/User";
import useGameStronghold, { EmptyPlayer, GameContext, Player } from "./app/Game";
import { usePackStronghold, PackContext, Deck, Whitecard } from "./app/Decks";
import { GameNode, Create as GameCreate, Lobby, Ingame, Packs as IngamePacks, Players } from "./pages/Game";
import { PlayerNode, Create as PlayerCreate, Play, Destroy } from "./pages/Player";
import { PublicNode, Home, About, Packs, Pack, PackNode } from "./pages/Public";
import { Menu as BurgerMenu } from "./components/Menu";
import { Themes } from './core/Theme'
import { LanguageContext } from "./core/Localization";
import "./assets/App.css";
import { GameNode as MockGamenode } from './pages/mock';

type PlayerFetch = {
  cards: Whitecard[]
};

const Providers = ({ providers, children }: any) => {
  const renderProvider = (providers: any, children: any): any => {
    const [provider, ...restProviders] = providers;

    if (provider) {
      return React.cloneElement(
        provider,
        undefined,
        renderProvider(restProviders, children)
      )
    }
    return children;
  }

  return renderProvider(providers, children)
}

function App() {
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(loadUser());
  const [game, dispatchGame] = useGameStronghold();
  const [packs, dispatchPacks] = usePackStronghold();
  const [_, setTheme] = useState('dark');
  const [deviceHeight, setDeviceHeight] = useState(window.innerHeight);
  const [counter, setCounter] = useState(0);

  const updateTimer = () => setCounter(counter + 1);

  const handleWindowResize = () => {
    setDeviceHeight(window.innerHeight);
    console.log("updated device height to " + window.innerHeight);
  }

  const fetchCards = (player: Player) => {
    Cfg.get(`/games/${game.meta.id}/cards/${player.id}`,
      (pf: PlayerFetch) => {
        dispatchGame({
          type: "ppoll",
          player: player,
          whitecards: pf.cards
        });
      },
      (response) => {
        console.log(`unable to fetch cards of player ${player}: ${response}`);
      },
    );
  }

  const handleGamePoll = () => {
    if (game.active === false)
      console.log("would have cancelled polling");
    if (game.meta.id === -1) {
      console.log(game);
      console.log("canceled polling");
      return;
    }
    console.log("handleGamePoll()");
    Cfg.get(`/games/${game.meta.id}`,
      (response) => {
        console.log(response);
        dispatchGame({
          type: "poll",
          ...response
        })
      }, (_) => {
        console.log("error " + _);
      })
    game.meta.players.map(player => fetchCards(player));
  }

  // initialize game packs
  useEffect(() => {
    Cfg.get('/packs/',
      ({ packs }: { packs: Deck[] }) => {
        //setPacks({ packs: packs });
        console.log(`populate packs...`);
        dispatchPacks({
          type: "populate",
          input: packs
        })
      }, (_) => {
        console.log("error " + _);
      });
  }, []);

  // handle game and window updates
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    const polling_id = setInterval(() => {
      handleGamePoll();
    }, Cfg.polling_delay);
    const context_id = setInterval(() => {
      updateTimer();
    }, Cfg.update_delay);
    return () => {
      clearInterval(polling_id);
      clearInterval(context_id);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [counter]);

  const fetchPacks = async (packIds: number[]) => {
    console.log("fetchPacks([...])");
    packIds.forEach(packId => Cfg.get(`/packs/${packId}`, response => {
      console.log(packId);
      console.log(response);
      dispatchPacks({
        type: "populate_single",
        input_wc: response.white,
        input_bc: response.black,
      })
    }, response => {
      throw "unable to fetch pack details (" + packId + "): " + response;
    }));
  };

  const setThemeHook = (name: string) => {
    console.log(`setThemeHook(name: ${name})`);
    for (const value of Themes[name])
      document.documentElement.style.setProperty(value.name, value.value);
    setTheme(name);
  };

  const handlePlayerCreate = (userName: string) => {
    console.log(`handleRegister(userName: ${userName})`);
    Cfg.post('/players/', { name: userName },
      (response) => {
        console.log(response)
        let user = { userId: response.id, userName: response.name, loggedIn: true };
        setUser(user);
        saveUser(user);
      },
      (response) => {
        console.log(response)
        throw "unable to create player";
      });
    return true;
  };

  const handlePlayerDestroy = () => {
    console.log(`handleLogout()`);
    Cfg.delete(`/players/${user.userId}`, () => { setUser(Guest); clearUser(); }, (response) => { throw response })
  };

  const handlePlayerDestroyCancel = () => {

  };

  const handleJoin = (id: number, goal: number, selectedPacks: number[]) => {
    console.log(`handleJoin(id: ${id})`);
    Cfg.patch(`/games/${id}/${user.userId}`, { action: "join" },
      (response) => {
        console.log(response);
        fetchPacks(selectedPacks);
        dispatchGame({
          type: "wakeup",
          input: {
            id: response.id,
            running: response.running,
            players: response.players,
            owner: response.owner,
            winner: response.winner,
            czar: EmptyPlayer,
            packs: response.packs,
            goal: goal,
          }
        })
      },
      (response) => {
        console.log(response);
        throw "unable to wake up game (via join)";
      })
  };

  const handleStartGame = (goal: number) => {
    console.log(`handleStartGame(id: ${game.meta.id})`);
    Cfg.post(`/games/${game.meta.id}/${user.userId}`, { action: "start" },
      (response) => {
        fetchPacks(response.packs);
        dispatchGame({
          type: "wakeup",
          input: {
            ...response,
            czar: EmptyPlayer,
            goal: goal,

            /*
            id: response.id,
            running: response.running,
            players: response.players,
            owner: response.owner,
            winner: response.winner,
            packs: response.packs,
            */
          }
        })
      },
      (response) => {
        console.log(response);
        throw "unable to wake up game (via start)";
      })
  };


  const handleCreate = (cardPackIds: number[], goalAmount: number) => {
    console.log(`handleCreate(cardPackIds: ${cardPackIds}, goalAmount: ${goalAmount})`);
    Cfg.post('/games/', {
      owner: user.userId,
      packs: cardPackIds,
      goal: goalAmount
    },
      (response) => {
        fetchPacks(response.packs);
        dispatchGame({
          type: "wakeup",
          input: {
            id: response.id,
            running: response.running,
            players: response.players,
            owner: response.owner,
            winner: response.winner,
            czar: response.czar,
            packs: response.packs,
            goal: response.goal,
          }
        })
      },
      (response) => {
        console.log(response);
        throw "unable to wake up game";
      })
  };

  const handleGames = (callback: (games: any) => void) => {
    Cfg.get(
      "/games/",
      (games) => callback(games["games"]),
      (response) => {
        callback([]);
        console.log("unable to fetch games to browse for playing!!!");
      }
    );
  };

  const handleOption = (num: number, card: Whitecard) => {
    dispatchGame({
      type: "pick",
      option: num,
      card: card,
    });
  };

  const handleConfirmOptions = (cards: number[]) => {
    Cfg.put(
      `/games/${game.meta.id}/cards/${user.userId}`,
      {
        cards: cards
      },
      () => {
        console.log("successfully CUMfirmed card options");
      },
      () => {
        console.log("unable to confirm card options");
      }
    );
  };

  const handleResetOptions = () => {
    dispatchGame(
      { type: "reset_pick" }
    );
  };
  
  const handleViewPack = (id: number) => {
    fetchPacks([id])
    dispatchPacks({
      type: "view",
      id: id,
    })
  }

  return (
    <Providers providers={[
      <LanguageContext.Provider value={language} />,
      <UserContext.Provider value={user} />,
      <GameContext.Provider value={game} />,
      <PackContext.Provider value={packs} />]}>
      <div style={{
        height: deviceHeight * 0.8
      }}>
        <HashRouter>
          <BurgerMenu onLanguageChanged={(code) => setLanguage(code)} onThemeChanged={setThemeHook} /> <br />

          <Routes>
            <Route path="/" element={<Navigate to="/public" />} />

            <Route path="public" element={<PublicNode />}>
              <Route index element={<Home />} />
              <Route path="packs" element={<PackNode />}>
                <Route index element={<Packs onView={handleViewPack} />}/>
                <Route path="view" element={<Pack />}/>
              </Route>
              <Route path="about" element={<About />} />
            </Route>

            <Route path="player" element={<PlayerNode />}>
              <Route index element={<PlayerCreate onCreate={handlePlayerCreate} />} />
              <Route path="play" element={<Play onGet={handleGames} onJoin={handleJoin} />} />
              <Route path="destroy" element={<Destroy onDestroy={handlePlayerDestroy} onCancel={handlePlayerDestroyCancel} />} />
            </Route>

            <Route path="game" element={<GameNode />}>
              <Route index element={<GameCreate onCreate={handleCreate} />} />
              <Route path="lobby" element={<Lobby onStart={handleStartGame} />} />
              <Route path="ingame" element={<Ingame onConfirm={handleConfirmOptions} onReset={handleResetOptions} onOption={handleOption} />} />
              <Route path="players" element={<Players />} />
              <Route path="packs" element={<IngamePacks />} />
            </Route>

            {Cfg.mock && <Route path="mock" element={<MockGamenode />}>
              <Route index element={<GameCreate onCreate={handleCreate} />} />
              <Route path="lobby" element={<Lobby onStart={() => { }} />} />
              <Route path="ingame" element={<Ingame onConfirm={handleConfirmOptions} onReset={handleResetOptions} onOption={handleOption} />} />
              <Route path="players" element={<Players />} />
              <Route path="packs" element={<IngamePacks />} />
            </Route>}

          </Routes>
        </HashRouter>
      </div></Providers>
  );
}

export default App;
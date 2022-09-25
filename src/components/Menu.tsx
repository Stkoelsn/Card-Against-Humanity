import React from 'react';
import { Link } from "react-router-dom";
import "../assets/Menu.css";
import { slide as BurgerMenu } from "react-burger-menu";
import { LanguageDef as ld, Flags, useLanguageContext } from "../core/Localization";
import { useUserContext } from "../app/User";
import { useGameContext } from "../app/Game";
import { userInfo } from 'os';

type LanguageUpdate = (a: string) => void;
type ThemeUpdate = (a: string) => void;
type MenuProps = {
  onLanguageChanged: LanguageUpdate;
  onThemeChanged: ThemeUpdate;
};
type FolderProps = {
  onClose: () => void;
};

function AccountOptions(props: FolderProps) {

  const user = useUserContext();

  if (!user.loggedIn ) {
    return (
      <div>
        <Link onClick={() => props.onClose()} id="dashboard" className="bm-item menu-item" to="/">
          {ld.formatString(ld.home)}
        </Link>
        <br />
        <Link onClick={() => props.onClose()} id="register" className="bm-item menu-item" to="/player">
          {ld.formatString(ld.register)}
        </Link>
      </div>
    );
  } else {
    return (
      <div>
        <label className="bm-user">{user.userName}</label>
        <br />
        <Link onClick={() => props.onClose()} id="dashboard" className="bm-item menu-item" to="/">
          {ld.formatString(ld.dashboard)}
        </Link>
        <br />
        <Link onClick={() => props.onClose()} id="logout" className="bm-item menu-item" to="/player/destroy">
          {ld.formatString(ld.logout)}
        </Link>
      </div>
    );
  }
}

function GameOptions(props: FolderProps) {
  const game = useGameContext();
  const user = useUserContext();
  //console.log(game)

  if (game.active &&  user.loggedIn) {
    return (
      <div>
        <Link onClick={() => props.onClose()} className="bm-item menu-item" to="/game/lobby">
          {ld.formatString(ld.lobby)}
        </Link> <br />
        <Link onClick={() => props.onClose()} className="bm-item menu-item" to="/game/ingame">
          {ld.formatString(ld.ingame)}
        </Link><br />
        <Link onClick={() => props.onClose()} className="bm-item menu-item" to="/game/players">
          {ld.formatString(ld.players)}
        </Link><br />
        <Link onClick={() => props.onClose()} className="bm-item menu-item" to="/game/packs">
          {ld.formatString(ld.packs)}
        </Link>
        <Link onClick={() => props.onClose()} className="bm-item menu-item" to="/game/games">
          {ld.formatString(ld.leave)}
        </Link>
        
        </div>
        
 
        
    );
  }
  if(user.loggedIn){
  return (<div>
    <Link onClick={props.onClose} className="bm-item menu-item" to="/game">
      {ld.formatString(ld.createGame)}
    </Link>

    <Link onClick={props.onClose} className="bm-item menu-item" to="/player/play">
      {ld.formatString(ld.games)}
    </Link></div>)
}
return(<div></div>)
}
export function Menu(props: MenuProps) {
  const lang = useLanguageContext();

  ld.setLanguage(lang);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };
  const handleStateChange = (state: { isOpen: boolean | ((prevState: boolean) => boolean); }) => {
    setIsMenuOpen(state.isOpen);
  };
  return (
    <BurgerMenu isOpen={isMenuOpen} onStateChange={handleStateChange}>

      <AccountOptions onClose={handleCloseMenu} />
      <GameOptions onClose={handleCloseMenu} />
      <Link onClick={handleCloseMenu} className="menu-item" to="/public/packs">
        {ld.formatString(ld.allPacks)}
      </Link>
      <Link onClick={handleCloseMenu} id="about" className="menu-item" to="/public/about">
        {ld.formatString(ld.about)}
      </Link>

      <div className="bm-bottompane">
        <button id="light" className="bm-light" onClick={(e) => props.onThemeChanged('light')}>{ld.formatString(ld.light)}</button>
        <button id="dark" className="bm-dark" onClick={(e) => props.onThemeChanged('dark')}>{ld.formatString(ld.dark)}</button>

        {Flags.map((country) => {
          return (
            <button key={country.code} className="bm-flag"><img
              alt={country.code}
              src={country.flagFilename}
              onClick={() => props.onLanguageChanged(country.code)}

              className="flag"
            /></button>
          );
        })}</div>
    </BurgerMenu>
  );
}
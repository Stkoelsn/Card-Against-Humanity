import { createContext, useContext } from "react";
import LocalizedStrings from "react-localization";
import Germany from "../assets/Germany.png";
import UnitedStates from "../assets/UnitedKingdom.png";

export const LanguageContext = createContext("de");

export const useLanguageContext = () => useContext(LanguageContext);

type Languages = {
  [key: string]: { [key: string]: string }
}

const def: Languages = {
  en: {
    login: "Login",
    register: "Register",
    home: "Home",
    about: "About",
    username: "Username",
    packname: "Packname",
    password: "Password",
    logout: "Logout",
    confirmPassword: "Confirm password",
    confirmLogout: "Are you sure that you wan't to log out?",
    aboutCreator: "Brought to you by Konrad Elsner and Birdman",
    aboutIssuers: "On behalf of Toni Barth",
    aboutInstitute: "Hochschule Anhalt FB5",
    confirmDelete: "Are you sure you want to delete your player?",
    delete: "Delete",
    cancel: "cancel",
    userAtleast4Length: "Username has to have at least 4 characters",
    passAtleast8Length: "Password has to have at least 8 characters!",
    passAtleast1Digit: "Password has to contain a digit!",
    passAtleast1Letter: "Password has to contain a letter!",
    passAtleast1Punct: "Password has to contain a special char!",
    leaderboards: "leaderboards",
    games: "Games",
    gameIsRunning: "running",
    gameOwner: "owner",
    gameParticipants: "players",
    playerName: "name",
    playerCPM: "cpm",
    playerScore: "score",
    light: "light",
    dark: "dark",
    repeatPassword: "Repeat password",
    join: "join",
    refresh: '⟳',
    nextPage: "next page",
    previousPage: "prev. page",
    firstPage: "first page",
    lastPage: "last page",
    playersSortName: "sort by name",
    playersSortCPM: "sort by cpm",
    playersSortScore: "sort by score",
    gamesSortRunning: "sort by status",
    gamesSortPlayers: "sort by player count",
    reverseSort: "reverse sort",
    leave: "leave",
    menu:"menu",
    sort:"sorting:",
    lobby: "Lobby",
    ingame: "Game",
    createGame: "Create Game",
    players: "Ingame Players",
    packs: "Ingame Packs",
    allPacks: "Packs",
    whitecount: "white card count",
    blackcount: "black card count",
    sortName: "sort by Name",
    sortBlack: "Black Cards",
    sortWhite: "White Cards",
    selectCardpacks:"Select Cardpacks!",
    running: "running",
    goal: "goal",
    setGoal: "Points to win",
    confirm: "confirm",
    waiting: "waiting",
    name: "Name",
    score: "Score",
    confirmOptions: "confirm options",
    resetOptions: "reset options",
    waitingPlayers: "Waiting for players: ",
    czar: "Czar: ",
    gameRunning: "The Game is running",
    gameNotRunning: "The game is not running",
    gameOwnerIs: "Gameowner: ",
    status: "status: ",
    maxPlayerCount: "Amount of Players: ",
    start: "start",
    basics: "basics",
    joinGame: "join game",
    createGameInfo1: "Check the packs you want to use in your game. You need to have at least 1 black card and 10 white Cards per Player.",
    createGameInfo2: "If you want to read up on the cards in the packs, go to packs in the menu and click on the info-button of the pack you are interested in.",
    createGameInfo3: "Below you set the amount of points a Player needs to win. This has to be at least 1!",
    createGameInfo4: "You will be redirected to the Lobby. You are the Leader and can start the game when there are at least 3 Player.",
    ingameInfo1: "In the upper Braket you have the black card on the left. In there you have _ which indicate Spaces that have to be filled with your White Cards.",
    ingameInfo2: "Next to it you see who the Czar is. He decides which player has ultimately won. Below it is the amount of players that are still chosing their cards.",
    ingameInfo3: "Finally on the right is the Scoreboard which shows the Player that are currently in the Game and how many points they have.",
    ingameInfo4: "In the lower braket you have 2 rows of white Cards. The upper row is populated with the chosen white cards. The czar has a button at the buttom of the cards to chose a winner.",
    ingameInfo5: "The lower row of white cards are your Cards. If the black card takes more than 1 white card you have buttons with numbers to chose where the white card is going.",
    ingameInfo6: "At the bottom of the screen you have a confirm button to finalize your decision and a reset button.",
    ingameInfo7: "The game end when a player reached the winning score or when the owner ends the game prematurely.",
    basicInfo1: "To open the menu click on the 3 stripes in the top left corner.",
    basicInfo2: "First you need to register. Click on register, chose a name and click on confirm.",
    basicInfo3: "In the bottom-region of the Menu you can change color-scheme as well as the lenguage. Sadly the lenguage-button doess not change the language of the pack yet.",
    basicInfo4: "When you stop playing or want to change your name click log-out in the menu.",
    joinGameInfo1: "In menu when you click games you see all currently existing games. You can only join a game if it isn't full. When you click join, you are redirected into the lobby.",
    joinGameInfo2: "You see the player and their points, the amount of points to win as well as a button to join the game if it is running.",
    joinGameInfo3: "If you want to see the pack, or leave, you can do that over the menu.",
    viewPack: "display",

  },
  de: {
    login: "Einloggen",
    register: "Registrieren",
    home: "Startbildschirm",
    about: "Über",
    username: "Nutzername",
    packname: "Packetname",
    password: "Passwort",
    logout: "Ausloggen",
    confirmPassword: "Passwort bestätigen",
    confirmLogout: "Sind sie sich sicher, dass sie sich ausloggen wollen?",
    aboutCreator: "Gebracht durch Konrad Elsner und Vogelman",
    aboutIssuers: "Auftrag von Toni Barth",
    aboutInstitute: "Hochschule Anhalt FB5",
    confirmDelete: "Sind sie sich sicher, dass sie ihren Charakter löschen wollen?",
    delete: "Löschen",
    cancel: "Abbrechen",
    userAtleast4Length: "Nutzername muss mindestens 4 Zeichen lang sein!",
    passAtleast8Length: "Passwort muss mindestens 8 Zeichen lang sein!",
    passAtleast1Digit: "Passwort muss mindestens ein Nummer enthalten!",
    passAtleast1Letter: "Passwort muss mindestens einen Buchstaben enthalten!",
    passAtleast1Punct: "Passwort muss mindestens ein Sonderzeichen enthalten!",
    light: "hell",
    dark: "dunkel",
    repeatPassword: "Passwort wiederholen",
    refresh: '⟳',
    leave: "leave",
    join: "beitreten",
    nextPage: "nächste Seite",
    previousPage: "vorher. Seite",
    firstPage: "erste Seite",
    lastPage: "letzte Seite",
    playersSortName: "nach Name",
    playersSortCPM: "nach BPM",
    playersSortScore: "nach Punkte",
    gamesSortRunning: "nach Status",
    gamesSortPlayers: "nach Spieler",
    reverseSort: "umdrehen",
    leaderboards: "Rangliste",
    games: "Spiele",
    gameIsRunning: "läuft",
    gameOwner: "Ersteller",
    gameParticipants: "Spieler",
    playerName: "Name",
    playerCPM: "BPM",
    playerScore: "Punkte",
    menu:"Menü",
    sort:"Sortierung:",
    lobby: "Lobby",
    ingame: "Spiel",
    createGame: "Spiel erstellen",
    players: "Spieler im Spiel",
    packs: "aktive Kartenpackete",
    allPacks: "Kartenpackete",
    whitecount: "Anzahler weißer Karten",
    blackcount: "Anzahler schwarzer Karten",
    sortName: "Name",
    sortBlack: "schwarz Karten",
    sortWhite: "weiße Karten",
    selectCardpacks: "wähle Kartenpackete!",
    running: "läuft",
    goal: "Ziel",
    setGoal: "Gewinnpunktzahl",
    confirm:"bestätigen",
    waiting: "wartend",
    name: "Name",
    score: "Punkte",
    confirmOptions: "Optionen bestätigen",
    resetOptions: "Optionen zurücksetzen",
    waitingPlayers: "Warten auf Spieler: ",
    czar: "Tzar: ",
    gameRunning: "Das Spiel läuft",
    gameNotRunning: "Das Spiel läuft nicht",
    gameOwnerIs: "Spielersteller: ",
    status: "Status: ",
    maxPlayerCount: "Spieleranzahl: ",
    start: "starten",
    basics: "Grundlagen",
    joinGame: "Spiel beitreten",
    createGameInfo1: "Wähle die Kartenpakete aus die du benutzen möchtest. Du brauchst mindestens eine schwarze Karte und 10 weiße Karten pro Spieler.",
    createGameInfo2: "Wenn du dir die Kartenpakete genauer angucken möchtest, gehe in den Paket-reiter im Menü und click auf den Infoknopf des Paketes dass dich interessiert.",
    createGameInfo3: "Darunter setzt du die benötigten Punkte zum Sieg. Dies muss mindestens 1 sein!",
    createGameInfo4: "Dann wirst du in den Lobby-Screen weitergeleitet. Du bist der Ersteller, sobald midnestens 3 Spieler in der Lobby sind kannst du das Spiel starten.",
    ingameInfo1: "Im oberen Bereich befindet sich links die schwarze Karte. Im Text der Karte befinden sich _ welche anzeigen dass dort eine weiße Karte benötigt wird.",
    ingameInfo2: "Daneben steht der Name des Tsars. Er entscheidet am ende der Runde wer Gewonnen hat. Darunter steht die Anzahl der Spieler die noch ihre Karten auswählen.",
    ingameInfo3: "Als letztes ganz Rechts ist das Scoreboard. Dort siehst du welche Spiele im Spiel sind und wieviele Punkte sie haben.",
    ingameInfo4: "Im unteren Bereich sind 2 Reihen an weißen Karten. Die obere Reihe ist nur während der Entscheidungsphase Gefüllt. Der Tzar hat einen Knopf pro Karte um zu entscheiden wer gewonnen hat.",
    ingameInfo5: "Die untere Reihe sind deine weißen Karten. Wenn es mehr als eine Lücke in der schwarzen Karte gibt, sind dort nummerierte Knöpfe um anzugeben in welche Lücke die Weiße Karte gehört.",
    ingameInfo6: "Am unteren Ende des Bildschirm gibt es einen bestätigen Knopf um die Auswahl abzugeben und einen Rücksetzungsknopf.",
    ingameInfo7: "Das Spiel endet wenn ein Spieler die maximale Punktzahl erreicht hat oder der Ersteller es vorzeitig beendet.",
    basicInfo1: "Um das Menü zu öffnen klicke auf die 3 Streifen am oberen linken Rand.",
    basicInfo2: "Als erstes musst du dich Registrieren. Klicke auf registrieren, gebe einen Namen ein und bestätige.",
    basicInfo3: "Am unteren Rand des Menüs kannst du das Farbschema und Die Sprache einstellen. Die Sprachwahl beeinflusst derzeit nicht die Kartenpakete.",
    basicInfo4: "Wenn du afhörst zu spielen oder einen neuen Namen haben möchtest, klicke auf ausloggen.",
    joinGameInfo1: "Im Menü wenn du auf Spiele klickst siehst alle derzeitig existierenden Spiele. Du kannst nur dem Spiel beitreten wenn die Spieleranzahl nicht erreicht ist. Wenn du beitreten drückst, tritts du der Lobby bei.",
    joinGameInfo2: "Du siehst die Spieler und ihre Punkte, die Siegpunktzahl sowie einen Knopf um dem Spiel beizutreten.",
    joinGameInfo3: "Wenn du die Pack angucken oder die Lobby verlassen möchtest, kannst du dass im Menü machen.",
  },
};

export const LanguageDef = new LocalizedStrings(def);

/**
 * 
 * @param lang chose language (burgermenu) 
 * @param id identification of the needed text
 * @returns translated text
 */
export function localizeId(lang: string, id: string) {
  return def[lang][id];
}

/**
 * links the flags in the burger menu with the language
 */
export const Flags = [
  { code: "de", flagFilename: Germany },
  { code: "en", flagFilename: UnitedStates },
];
import { createContext, useContext } from "react";

export type User = {
  userId: number,
  userName: string;
  loggedIn: boolean;
};

export const Guest: User = {
  userId: -1,
  userName: "Guest",
  loggedIn: false,
};

export type Requirements = {
  messages: string[],
  valid: boolean
};

type Requirement = {
  regex: RegExp,
  message: string,
};

export const RequirementsOk: Requirements = {
  messages: [],
  valid: true
}

const minUser: Requirement[] = [
  { regex: /[\w\döäüÖÄÜ]{4,16}/g, message: "userAtleast4Length" }, // userAtleast4Digits
];

const minPass: Requirement[] = [
  { regex: /^.{8}/g, message: "passAtleast8Length" },
  { regex: /\d/g, message: "passAtleast1Digit" },
  { regex: /\w/g, message: "passAtleast1Letter" },
  { regex: /[.:;:-_#'+*~``?\\=})\](\[/{&¬%½$¼§³"²!¹]/g, message: "passAtleast1Punct" },
];

export const UserContext = createContext<User>(Guest);
export const useUserContext = () => useContext(UserContext);

export function checkUserName(username: string) {
  var userMsgs = [];
  if(username.length < 4)
    userMsgs.push("userAtleast4Length")
  return {
    messages: userMsgs,
    valid: userMsgs.length == 0,
  };
}

export function checkPassWord(password: string): Requirements {
  var passMsgs = [];
  for (let i = 0; i < minPass.length; i++) {
    const element = minPass[i];
    if(password.search(element.regex) == -1)
      passMsgs.push(element.message);
  }

  return {
    messages: passMsgs,
    valid: passMsgs.length == 0,
  };
}

export function checkRequirements(username: string, password: string): Requirements {
  const user = checkUserName(username);
  const pass = checkUserName(password);
  return {
    messages: [...user.messages, ...pass.messages],
    valid: user.valid && pass.valid,
  }
}

export function loadUser(): User {
  const userName = localStorage.getItem("cah-user-name");
  const userId = localStorage.getItem("cah-user-id");
  if (userName == null || userId == null) {
    return Guest;
  }
  return {
    userName: userName,
    userId: Number.parseInt(userId),
    loggedIn: userId.length > 0 && userName.length > 0
  };
}

export function saveUser(usr: User) {
  if (usr.loggedIn && usr.userId != undefined) {
    localStorage.setItem("cah-user-name", usr.userName);
    localStorage.setItem("cah-user-id", usr.userId.toString());
    console.log("successfuly saved");
  } else {
    console.log("unable to save user info because you are either not logged in or have not been assigned a real user id");
  }
}

export function clearUser() {
    localStorage.setItem("cah-user-name", "");
    localStorage.setItem("cah-user-id", "");
}
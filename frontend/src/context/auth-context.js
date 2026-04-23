import { createContext } from "react";

export const AuthContext = createContext({
  loggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});

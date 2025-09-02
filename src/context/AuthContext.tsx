import { decodeJwt } from "jose";
import React, { createContext, useContext, useState } from "react";
import { type User } from "../hooks/users";

const API_URL = import.meta.env.VITE_API_URL;

type AuthContextProps = {
  login: (code: string) => Promise<boolean>;
  user: User | null;
};

const AuthContext = createContext<AuthContextProps>({ login: async () => false, user: null });

const useAuth = () => useContext(AuthContext);

function getLocalStorageUser(): User | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload: User = decodeJwt(token);
  return payload;
}

function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(getLocalStorageUser());

  const login = async (code: string) => {
    const res = await fetch(API_URL + "/oauth/exchange", {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.status != 200) return false;

    const data = await res.json();
    const payload: User = decodeJwt(data.token);
    setUser(payload);
    localStorage.setItem("token", data.token);
    return true;
  };

  return <AuthContext.Provider value={{ login, user }}>{children}</AuthContext.Provider>;
}

export { AuthProvider, useAuth };

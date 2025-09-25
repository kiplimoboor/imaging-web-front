import { decodeJwt } from "jose";
import React, { createContext, useContext, useState } from "react";
import { type User } from "../hooks/users";

type AuthContextProps = { login: (code: string) => Promise<boolean>; user: User | null };

const AuthContext = createContext<AuthContextProps>({ login: async () => false, user: null });

const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (code: string) => {
    const res = await fetch("https://radiology.mtrh.go.ke/oauth/exchange", {
      method: "POST",
      credentials: "include",
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

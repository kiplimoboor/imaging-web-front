import { decodeJwt } from "jose";
import React, { createContext, useContext, useState } from "react";
import { type User } from "../hooks/users";

type AuthContextProps = {
  login: (code: string) => Promise<boolean>;
  user: User | null;
  isPrivileged: boolean;
  loadingAuth: boolean;
  authCheck: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  login: async () => false,
  user: null,
  isPrivileged: false,
  loadingAuth: true,
  authCheck: () => {},
});

const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: React.PropsWithChildren) {
  const privilegedRoles = ["Administrator", "Support"];
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const authCheck = async () => {
    const res = await fetch("https://radiology.mtrh.go.ke/oauth/check", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (res.status !== 200) setLoadingAuth(false);
    else {
      const data = await res.json();
      setUser(data);
      setLoadingAuth(false);
    }
    return;
  };

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

  return (
    <AuthContext.Provider
      value={{
        login,
        user,
        isPrivileged: Boolean(user && privilegedRoles.includes(user.role)),
        loadingAuth,
        authCheck,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };

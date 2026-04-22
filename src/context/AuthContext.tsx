import React, { createContext, useContext, useState } from "react";
import type { User } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

type AuthContextProps = {
  login: (code: string) => Promise<boolean>;
  user: User | null;
  isPrivileged: boolean;
  isRadiologist: boolean;
  isSecretary: boolean;
  isGuest: boolean;
  loadingAuth: boolean;
  authCheck: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  login: async () => false,
  user: null,
  isPrivileged: false,
  isRadiologist: false,
  isSecretary: false,
  isGuest: false,
  loadingAuth: true,
  authCheck: () => {},
});

const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const authCheck = async () => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (params.get("auto-login") === "1") {
      window.history.replaceState(null, "", "/");
    }
    const res = await fetch(API_URL + "/oauth/check", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (res.status !== 200) return setLoadingAuth(false);
    else {
      const user: User = await res.json();
      if (user.role === "System User") user.role = "Radiologist";
      setUser(user);
      setLoadingAuth(false);
    }
  };

  const login = async (code: string) => {
    const res = await fetch(API_URL + "/oauth/exchange", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ code }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status != 200) return false;
    const user: User = await res.json();
    if (user.role === "System User") user.role = "Radiologist";
    setUser(user);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        user,
        isPrivileged: Boolean(user?.admin),
        isRadiologist: user?.role === "Radiologist" || user?.role === "Registrar",
        isSecretary: user?.role === "Secretary",
        isGuest: user?.role === "Guest",
        loadingAuth,
        authCheck,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };

import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

function AuthCallback() {
  const { login } = useAuth();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loginUser() {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      if (code == null) {
        setError(true);
        return;
      }
      const success = await login(code);

      if (success) setLoggedIn(true);
      else setError(true);
    }
    loginUser();
  }, []);

  if (loggedIn) return <Navigate to="/dashboard" />;

  if (error) return <Navigate to="/401" />;

  return "Loading...";
}

export default AuthCallback;

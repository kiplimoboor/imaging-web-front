import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import LoadingCircle from "./LoadingSpinner";

function AuthCallback() {
  const { login } = useAuth();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const redirectPathRef = useRef<string | null>(null);

  useEffect(() => {
    async function loginUser() {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      if (code == null) {
        setError(true);
        return;
      }
      const success = await login(code);

      if (success) {
        redirectPathRef.current = sessionStorage.getItem("postLoginRedirect");
        sessionStorage.removeItem("postLoginRedirect");
        setLoggedIn(true);
      } else {
        setError(true);
      }
    }

    loginUser();
  }, []);

  if (loggedIn) {
    return <Navigate to={redirectPathRef.current || "/"} />;
  }

  if (error) return <Navigate to="/401" />;

  return <LoadingCircle />;
}

export default AuthCallback;

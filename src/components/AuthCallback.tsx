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

  if (loggedIn) return <Navigate to="/" />;

  if (error) return <Navigate to="/401" />;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-800"></div>
        <p className="text-gray-800 text-lg">Loading...</p>
      </div>
    </div>
  );
}

export default AuthCallback;

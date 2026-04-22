import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useSearchParams } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { loginRedirect } from "../utils/auth";

function PrivateRoutes() {
  const { user, loadingAuth, authCheck } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const autoLogin = Number(searchParams.get("auto-login"));

  useEffect(() => {
    authCheck();
  }, []);

  if (loadingAuth) {
    return <LoadingSpinner message="Checking Credentials" />;
  }

  if (user === null) {
    if (autoLogin === 1) {
      sessionStorage.setItem("postLoginRedirect", location.pathname + location.search);
      return loginRedirect();
    }
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

function AdminRoutes() {
  const { user, isPrivileged } = useAuth();
  if (user == null) return <PrivateRoutes />;
  if (!isPrivileged) return <Navigate to="/401" />;
  return <Outlet />;
}

export { AdminRoutes, PrivateRoutes };

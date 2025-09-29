import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import LoadingCircle from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { loginRedirect } from "../utils/auth";

function PrivateRoutes() {
  const { user, loadingAuth, authCheck } = useAuth();
  const location = useLocation();

  useEffect(() => {
    authCheck();
  }, []);

  if (loadingAuth) return <LoadingCircle />;

  if (user === null) {
    sessionStorage.setItem("postLoginRedirect", location.pathname + location.search);
    return loginRedirect();
  }
  return <Outlet />;
}

function AdminRoutes() {
  const { user } = useAuth();
  if (user == null) return <PrivateRoutes />;
  if (user.admin == false) return <Navigate to="/401" />;
  return <Outlet />;
}

export { AdminRoutes, PrivateRoutes };

import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { loginRedirect } from "../utils/auth";

function PrivateRoutes() {
	const { user, loadingAuth, authCheck } = useAuth();
	const location = useLocation();

	useEffect(() => {
		authCheck();
	}, []);

	if (loadingAuth) return <LoadingSpinner message="Checking Credentials" />;

	if (user === null) {
		sessionStorage.setItem("postLoginRedirect", location.pathname + location.search);
		return loginRedirect();
	}

	if (user.role === "Guest") return <Navigate to="/guest" />;

	return <Outlet />;
}

function AdminRoutes() {
	const { user } = useAuth();
	if (user == null) return <PrivateRoutes />;
	if (user.admin == false) return <Navigate to="/401" />;
	return <Outlet />;
}

function GuestRoutes() {
	const { user } = useAuth();
	if (user == null) return <PrivateRoutes />;
	return <Outlet />;
}

export { AdminRoutes, PrivateRoutes, GuestRoutes };

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

	return <Outlet />;
}

function AdminRoutes() {
	const { user, isPrivileged } = useAuth();
	if (user == null) return <PrivateRoutes />;
	if (!isPrivileged) return <Navigate to="/401" />;
	return <Outlet />;
}

function RadiologistRoutes() {
	const { user, isRadiologist } = useAuth();
	if (user == null) return <PrivateRoutes />;
	if (!isRadiologist) return <Navigate to="/401" />;
	return <Outlet />;
}

export { AdminRoutes, PrivateRoutes, RadiologistRoutes };

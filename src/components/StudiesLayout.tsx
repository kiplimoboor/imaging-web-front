import { Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import Analytics from "./Analytics";
import Navbar from "./Navbar";
import NavTabs from "./NavTabs";

function StudiesLayout() {
	const { isPrivileged } = useAuth();
	return (
		<>
			<Navbar />
			{isPrivileged && <Analytics />}
			<div className="w-10/12 mx-auto">
				<NavTabs />
				<Outlet />
			</div>
		</>
	);
}

export default StudiesLayout;

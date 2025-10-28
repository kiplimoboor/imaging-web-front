import { Outlet } from "react-router";
import Analytics from "@/components/Analytics";
import Navbar from "@/components/Navbar";
import NavTabs from "@/components/NavTabs";
import { useAuth } from "@/context/AuthContext";

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

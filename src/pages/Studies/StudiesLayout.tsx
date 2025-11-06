import { Outlet } from "react-router";
import Analytics from "@/components/Analytics";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import NavTabs from "@/components/NavTabs";
import { useAuth } from "@/context/AuthContext";

function StudiesLayout() {
	const { isPrivileged } = useAuth();
	return (
		<>
			<Navbar />
			{isPrivileged && <Analytics />}
			{isPrivileged && <Header />}
			<div className="w-10/12 mx-auto">
				<NavTabs />
				<Outlet />
			</div>
		</>
	);
}

export default StudiesLayout;

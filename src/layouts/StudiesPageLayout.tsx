import type { ReactNode } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import NavTabs from "@/components/NavTabs";
import { useAuth } from "@/context/AuthContext";

function StudiesLayout({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	return (
		<>
			<Navbar />
			<Header />
			<div className="w-10/12 mx-auto">
				{user && !["Guest", "Secretary"].includes(user?.role) && <NavTabs />}
				{children}
			</div>
		</>
	);
}

export default StudiesLayout;

import type { ReactNode } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import NavTabs from "@/components/NavTabs";

function StudiesLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			<Header />
			<div className="w-10/12 mx-auto">
				<NavTabs />
				{children}
			</div>
		</>
	);
}

export default StudiesLayout;

import type { ReactNode } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import NavTabs from "./NavTabs";

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

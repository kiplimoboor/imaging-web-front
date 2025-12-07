import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

function NavTabs() {
	const location = useLocation();
	const currentTab = location.pathname;
	const { user } = useAuth();
	const tabs = [];

	if (user && ["Radiologist", "Regstrar", "Administrator", "Support"].includes(user?.role)) {
		tabs.push([<Tab key="/all" label="All Studies" value="/all" to="/all" component={Link} />]);
	}

	if (user?.role === "Radiologist" || user?.role === "Registrar") {
		tabs.push(<Tab key="/" label="My Studies" value="/" to="/" component={Link} />);
	}

	if (user?.role === "Administrator" || user?.role === "Support") {
		tabs.push(
			<Tab key="/new" label="New Studies" value="/new" to="/new" component={Link} />,
			<Tab key="/completed" label="Complete" value="/completed" to="/completed" component={Link} />,
		);
	}

	if (user?.role === "Secretary") {
		tabs.push(<Tab key="/" label="Completed" value="/" to="/" component={Link} />);
	}

	// if (isRadiologist)
	// 	tabs.push(
	// 		<Tab key="/all" label="All Studies" value="/all" to="/all" component={Link} />,
	// 		<Tab key="/" label="My Studies" value="/" to="/" component={Link} />,
	// 	);
	//
	// if (isPrivileged) {
	// 	tabs.push(
	// 		<Tab key="/" label="All Studies" value="/" to="/" component={Link} />,
	// 		<Tab key="/new" label="New Studies" value="/new" to="/new" component={Link} />,
	// 		<Tab key="/complete" label="Complete" value="/complete" to="/complete" component={Link} />,
	// 	);
	// }

	return <Tabs value={currentTab}>{tabs}</Tabs>;
}

export default NavTabs;

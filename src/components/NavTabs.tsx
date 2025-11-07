import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

function NavTabs() {
	const location = useLocation();
	const currentTab = location.pathname;
	const { isPrivileged, isRadiologist, user } = useAuth();
	const isSupport = user?.role === "Support";
	const tabs = [];

	if (isSupport) tabs.push(<Tab key="/" label="All Studies" value="/" to="/" component={Link} />);

	if (isRadiologist)
		tabs.push(
			<Tab key="/all" label="All Studies" value="/all" to="/all" component={Link} />,
			<Tab key="/" label="My Studies" value="/" to="/" component={Link} />,
		);

	if (isPrivileged) {
		tabs.push(
			<Tab key="/new" label="New Studies" value="/new" to="/new" component={Link} />,
			<Tab key="/complete" label="Complete" value="/complete" to="/complete" component={Link} />,
		);
	}

	return <Tabs value={currentTab}>{tabs}</Tabs>;
}

export default NavTabs;

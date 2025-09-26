import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Link, useLocation } from "react-router";

function NavTabs() {
  const location = useLocation();
  const currentTab = location.pathname;

  return (
    <Tabs value={currentTab}>
      <Tab label="My Studies" value="/" to="/" component={Link} />
      <Tab label="New Studies" value="/new" to="/new" component={Link} />
      <Tab label="All Studies" value="/all" to="/all" component={Link} />
    </Tabs>
  );
}

export default NavTabs;

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";

type TabPanelProps = { children?: React.ReactNode; index: number; value: number };

function CustomTabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

type TabNavProps = { tabs: { label: string; component: React.ReactNode }[] };

function TabNav({ tabs }: TabNavProps) {
  const [value, setValue] = React.useState(() => {
    const savedTab = sessionStorage.getItem("activeTab");
    return savedTab !== null ? parseInt(savedTab, 10) : 0;
  });
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    sessionStorage.setItem("activeTab", newValue.toString());
  };

  return (
    <div className="w-10/12 mx-auto mt-3">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <CustomTabPanel value={value} key={index} index={index}>
          {tab.component}
        </CustomTabPanel>
      ))}
    </div>
  );
}

export default TabNav;

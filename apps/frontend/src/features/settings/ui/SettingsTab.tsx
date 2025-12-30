import { Tabs, Tab } from "@mui/material";
import { tabs } from "../model/tabs";
import { useSettingsStore } from "../model/useSettingsStore";

function SettingsTabs() {

    const { selectedTab, setSelectedTab } = useSettingsStore();

    return (
        <Tabs
            value={selectedTab}
            onChange={(e: React.SyntheticEvent, n: number) => {
                setSelectedTab(n)
            }}
            variant="scrollable"
            scrollButtons="auto"
        >
            {tabs.map((tab, i) => (
                <Tab key={i} label={tab.name} />
            ))}
        </Tabs>
    );
}

export default SettingsTabs;
import { tabs } from "../model/tabs";
import { useSettingsStore } from "../model/useSettingsStore";

function SettingsContent() {
    const { selectedTab } = useSettingsStore();

    return (
        <div className="mt-6">
            {tabs[selectedTab].node}
        </div>
    );
}

export default SettingsContent;
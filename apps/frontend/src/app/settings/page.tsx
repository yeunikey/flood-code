'use client'

import View from "@/shared/ui/View";
import SettingsTabs from "@/features/settings/ui/SettingsTab";
import SettingsContent from "@/features/settings/ui/SettingsContent";

export default function SettingsPage() {

    return (
        <View links={['Паводки', 'Настройки']} className="px-6 grow">

            <SettingsTabs />
            <SettingsContent />

        </View>
    )
}
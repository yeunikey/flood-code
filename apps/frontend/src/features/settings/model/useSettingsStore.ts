import { create } from 'zustand';

type SettingsStore = {
    selectedTab: number;
    setSelectedTab: (type: number) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
    selectedTab: 0,
    setSelectedTab: (selectedTab) => set({ selectedTab }),
}));

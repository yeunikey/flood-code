import Site from '@/entites/site/types/site';
import { create } from 'zustand';

type SelectedSites = Record<string, boolean>;

type LayerState = {
    selectedSites: SelectedSites;
    setSelectedSites: (sites: SelectedSites) => void;
    toggleSite: (key: string) => void;

    getActiveSiteIdsByCategory: () => Record<number, number[]>;

    infoCollapse: boolean;
    setInfoCollapse: (infoCollapse: boolean) => void;

    selectedSite: Site | null;
    setSelectedSite: (site: Site | null) => void;

    clearSelectedSites: () => void;
};

export const useLayersStore = create<LayerState>((set, get) => ({
    selectedSites: {},

    setSelectedSites: (sites) => set({ selectedSites: sites }),

    toggleSite: (key) =>
        set((state) => ({
            selectedSites: {
                ...state.selectedSites,
                [key]: !state.selectedSites[key], 
            },
        })),

    getActiveSiteIdsByCategory: () => {
        const result: Record<number, number[]> = {};
        const entries = Object.entries(get().selectedSites);

        for (const [key, enabled] of entries) {
            if (!enabled) continue;

            const [catIdStr, siteIdStr] = key.split('-');
            const catId = Number(catIdStr);
            const siteId = Number(siteIdStr);

            if (!result[catId]) result[catId] = [];
            result[catId].push(siteId);
        }

        return result;
    },

    infoCollapse: false,
    setInfoCollapse: (infoCollapse) => set({ infoCollapse }),

    selectedSite: null,
    setSelectedSite: (selectedSite) => set({
        selectedSite
    }),
    clearSelectedSites: () => set({ selectedSites: {} }),

}));

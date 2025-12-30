import { api } from "@/shared/model/api/instance";
import { ApiResponse } from "@/types";
import { create } from "zustand";
import Site from "../types/site";

type SitesState = {
    sites: Site[];
    isLoading: boolean;
    setSites: (sites: Site[]) => void;
    fetchSites: (token: string) => Promise<void>;
};

export const useSites = create<SitesState>((set) => ({
    sites: [],
    isLoading: true,

    setSites: (qcls) => set({ sites: qcls }),

    fetchSites: async (token: string) => {
        set({ isLoading: true });

        await api.get<ApiResponse<Site[]>>("/sites", {
            headers: { Authorization: "Bearer " + token },
        })
            .then(({ data }) => {
                set({ sites: data.data });
            })
            .finally(() => {
                set({ isLoading: false });
            });
    }
}));

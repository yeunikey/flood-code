import { api } from "@/shared/model/api/instance";
import { ApiResponse, Unit } from "@/types";
import { create } from "zustand";

type UnitState = {
    units: Unit[];
    isLoading: boolean;
    setUnits: (units: Unit[]) => void;
    fetchUnits: (token: string) => void;
    addUnit: (unit: Unit) => void;
};

export const useUnits = create<UnitState>((set) => ({
    units: [],
    isLoading: true,

    setUnits: (units) => set({ units }),

    fetchUnits: async (token: string) => {
        set({ isLoading: true });

        await api
            .get<ApiResponse<Unit[]>>("/variables/units", {
                headers: { Authorization: "Bearer " + token },
            })
            .then(({ data }) => {
                set({ units: data.data });
            })
            .finally(() => {
                set({ isLoading: false });
            });
    },

    addUnit: (unit) =>
        set((state) => ({
            units: [...state.units, unit],
        })),
}));

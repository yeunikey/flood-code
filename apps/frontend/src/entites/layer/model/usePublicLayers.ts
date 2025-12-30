import { create } from "zustand";

type LayerVisibilityState = {
    layerStates: {
        lakesRivers: boolean;
        regionBorders: boolean;
    };
    toggleLayer: (key: keyof LayerVisibilityState['layerStates']) => void;
    setLayerStates: (states: Partial<LayerVisibilityState['layerStates']>) => void;
};

export const useLayerVisibility = create<LayerVisibilityState>((set) => ({
    layerStates: {
        lakesRivers: true,
        regionBorders: true,
    },
    toggleLayer: (key) =>
        set((state) => ({
            layerStates: {
                ...state.layerStates,
                [key]: !state.layerStates[key],
            },
        })),
    setLayerStates: (states) =>
        set((state) => ({
            layerStates: { ...state.layerStates, ...states },
        })),
}));

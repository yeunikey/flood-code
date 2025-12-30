import { create } from "zustand";
import Layer from "../types/layer";

type LayerState = {
    layers: Layer[];
    setLayers: (methods: Layer[]) => void;

    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
};

export const useLayers = create<LayerState>((set) => ({
    layers: [],
    setLayers: (layers) => set({ layers }),

    isLoading: true,
    setLoading: (isLoading) => set({ isLoading }),

}));

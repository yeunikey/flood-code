import { create } from "zustand";

type MapType = {
    map: mapboxgl.Map | null;
    setMap: (map: mapboxgl.Map | null) => void;

    loading: boolean,
    setLoading: (loading: boolean) => void

};

export const useSpatialMap = create<MapType>((set) => ({
    map: null,
    setMap: (map) => set({
        map: map
    }),

    loading: false,
    setLoading: (loading) => set({
        loading: loading
    })
}));
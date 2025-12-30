import { Tile } from "@/types";
import { create } from "zustand";

type SpatialType = {
    tiles: Tile[];
    setTiles: (tiles: Tile[]) => void;

    selectedTile: Tile | null;
    setSelectedTile: (tile: Tile | null) => void;
};

export const useSpatialStore = create<SpatialType>((set) => ({
    tiles: [],
    setTiles: (tiles) => set({
        tiles
    }),

    selectedTile: null,
    setSelectedTile: (tile) => set({
        selectedTile: tile
    }),
}));
// features/pools/model/usePools.ts

import { create } from "zustand";

export interface Pool {
    site_codes: string[];
    name: string;
    file: string;
    visible: boolean;
}

interface PoolsState {
    pools: Pool[];
    togglePoolVisibility: (name: string) => void;
    setPools: (pools: Pool[]) => void;
}

export const usePools = create<PoolsState>((set) => ({
    pools: [
        {
            site_codes: ["11126", "11129", "11146", "11147", "11124", "11143", "11131", "11148", "11130", "11136", "11123", "11133", "4978430", "4928570"],
            name: "Буктырма",
            file: "Буктырма.geojson",
            visible: false,
        },
        {
            site_codes: ["11094", "4908340", ""],
            name: "Буктырминское вдхр. до р. Куршим",
            file: "Буктырминское вдхр. до р. Ку.geojson",
            visible: false,
        },
        {
            site_codes: ["11117", "11118"],
            name: "Буктырминское вдхр.",
            file: "Буктырминское вдхр..geojson",
            visible: false,
        },
        {
            site_codes: [],
            name: "Бурчун",
            file: "Бурчун.geojson",
            visible: false,
        },
        {
            site_codes: [
                "11019", "11164", "11170", "11187", "11163", "11188", "11661", "11668",
                "11160", "11189", "11005", "11173", "11159", "5008270", "5038360", "4968350"
            ],
            name: "Ертис между Буктырминским и  Шульбинским",
            file: "Ертис между Буктырминским.geojson",
            visible: false,
        },
        {
            site_codes: ["11077", "4768370"],
            name: "Кандысу (Шорга)",
            file: "Кандысу (Шорга).geojson",
            visible: false,
        },
        {
            site_codes: [],
            name: "Кара Ертис (верховья)",
            file: "Кара Ертис (верховья).geojson",
            visible: false,
        },
        {
            site_codes: [],
            name: "Кара Ертис до  слияния с р. Каба",
            file: "Кара Ертис до слияния с р. К.geojson",
            visible: false,
        },
        {
            site_codes: ["11001", "11063", "11068", "11003", "4808220", "4848570", "4888600"],
            name: "Кара Ертис после слияния с р. Каба",
            file: "Кара Ертис после слияния с.geojson",
            visible: false,
        },
        {
            site_codes: [],
            name: "Кара Ертис у г. Алтай (до слияния с р. Бурчун)",
            file: "Кара Ертис у г. Алтай (до сли.geojson",
            visible: false,
        },
        {
            site_codes: [],
            name: "Коба",
            file: "Коба.geojson",
            visible: false,
        },
        {
            site_codes: ["11108", "11110", "4868370"],
            name: "Куршим",
            file: "Куршим.geojson",
            visible: false,
        },
        {
            site_codes: ["11207", "11199", "11203", "11219", "5068190"],
            name: "Оба",
            file: "Оба.geojson",
            visible: false,
        },
        {
            site_codes: [],
            name: "оз. Жайсан между Кандысу и У",
            file: "оз. Жайсан между Кандысу и У.geojson",
            visible: false,
        },
        {
            site_codes: ["11004"],
            name: "оз. Жайсан между Кара Ертис",
            file: "оз. Жайсан между Кара Ертис.geojson",
            visible: false,
        },
        {
            site_codes: [],
            name: "Тургын",
            file: "Тургын.geojson",
            visible: false,
        },
        {
            site_codes: [],
            name: "Шульбинское вдхр.",
            file: "Шульбинское вдхр..geojson",
            visible: false,
        },
    ],
    togglePoolVisibility: (name) => set((state) => ({
        pools: state.pools.map(pool =>
            pool.name === name ? { ...pool, visible: !pool.visible } : pool
        )
    })),
    setPools: (pools) => set({ pools }),
}));

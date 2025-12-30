import { Category } from '@/entites/category/types/categories';
import Site from '@/entites/site/types/site';
import Variable from '@/entites/variable/types/variable';
import { GroupedData } from '@/types';
import { create } from 'zustand';

type InfoState = {
    infoVariables: Variable[],
    setInfoVariables: (infoVariables: Variable[]) => void,

    infoData: GroupedData[],
    setInfoData: (infoData: GroupedData[]) => void,

    site: Site | null,
    setSite: (site: Site | null) => void,

    category: Category | null,
    setCategory: (category: Category | null) => void,
};

export const useInfoStore = create<InfoState>((set) => ({
    infoVariables: [],
    setInfoVariables: (infoVariables: Variable[]) => set({
        infoVariables
    }),

    infoData: [],
    setInfoData: (infoData: GroupedData[]) => set({
        infoData
    }),

    site: null,
    setSite: (site: Site | null) => set({
        site
    }),

    category: null,
    setCategory: (category: Category | null) => set({
        category
    }),
}));

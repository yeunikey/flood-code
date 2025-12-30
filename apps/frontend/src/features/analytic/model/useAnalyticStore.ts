'use client'

import { GroupedData } from "@/types";
import Variable from "@/entites/variable/types/variable";
import { create } from "zustand";

export interface AnalyticVariable extends Variable {
    categoryId: number;
    siteId: number;
}

type AnalyticStore = {
    variables: Record<string, AnalyticVariable[]>;
    infoValues: Record<string, GroupedData[]>;

    disabledVariables: Record<number, number[]>;
    variableCollapse: boolean;
    viewMode: "table" | "chart";

    page: number;
    rowsPerPage: number;

    fromDate: Date | null;
    toDate: Date | null;

    // --- actions ---
    setVariables: (vars: Record<string, AnalyticVariable[]>) => void;
    setInfoValues: (vals: Record<string, GroupedData[]>) => void;
    toggleVariable: (siteId: number, variableId: number) => void;
    setVariableCollapse: (val: boolean) => void;
    setViewMode: (mode: "table" | "chart") => void;
    setPage: (page: number) => void;
    setRowsPerPage: (rows: number) => void;
    setFromDate: (date: Date | null) => void;
    setToDate: (date: Date | null) => void;
    setGroupedVariables: (groupedVariables: Record<string, AnalyticVariable[]>) => void;

    // --- selectors ---
    groupedVariables: Record<string, AnalyticVariable[]>;
};

export const useAnalyticStore = create<AnalyticStore>((set, get) => ({
    variables: {},
    infoValues: {},
    disabledVariables: {},
    variableCollapse: true,
    viewMode: "table",
    page: 0,
    rowsPerPage: 10,
    fromDate: null,
    toDate: null,

    setVariables: (variables) => set({ variables }),
    setInfoValues: (infoValues) => set({ infoValues }),
    toggleVariable: (siteId, variableId) => {
        const current = get().disabledVariables[siteId] || [];
        const exists = current.includes(variableId);
        set({
            disabledVariables: {
                ...get().disabledVariables,
                [siteId]: exists ? current.filter(v => v !== variableId) : [...current, variableId]
            }
        });
    },
    setVariableCollapse: (val) => set({ variableCollapse: val }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setPage: (page) => set({ page }),
    setRowsPerPage: (rows) => set({ rowsPerPage: rows }),
    setFromDate: (date) => set({ fromDate: date }),
    setToDate: (date) => set({ toDate: date }),
    setGroupedVariables: (groupedVariables) => set({ groupedVariables }),

    groupedVariables: {},
}));

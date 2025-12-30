/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/shared/model/api/instance";
import { authHeader } from "@/shared/model/utils";
import { useAnalyticStore } from "./useAnalyticStore";
import { useAuth } from "@/shared/model/auth";
import { useEffect } from "react";
import { useLayersStore } from "@/features/monitor/model/useLayersStore";

export const useFetchVariables = () => {
    const { token } = useAuth();
    const { selectedSites } = useLayersStore();
    const { variables, setVariables } = useAnalyticStore();

    useEffect(() => {
        const fetchData = async () => {
            const newVars = { ...variables };

            for (const [siteCode, isSelected] of Object.entries(selectedSites)) {
                if (isSelected && !newVars[siteCode]) {
                    const [categoryId, siteId] = siteCode.split("-");
                    const res = await api.get(`/data/category/${categoryId}/variables`, authHeader(token));
                    newVars[siteCode] = res.data.data.map((v: any) => ({ ...v, categoryId: Number(categoryId), siteId: Number(siteId) }));
                }
            }

            setVariables(newVars);
        };
        fetchData();
    }, [selectedSites]);
};

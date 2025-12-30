import { api } from "@/shared/model/api/instance";
import { authHeader } from "@/shared/model/utils";
import { useAnalyticStore } from "./useAnalyticStore";
import { useEffect } from "react";
import { useLayers } from "@/entites/layer/model/useLayers";

export const useFetchInfoValues = () => {
    const { variables, infoValues, setInfoValues } = useAnalyticStore();
    const { layers } = useLayers();

    useEffect(() => {
        const fetchData = async () => {
            const newInfo = { ...infoValues };

            for (const [siteCode] of Object.entries(variables)) {
                if (!newInfo[siteCode]) {
                    const [categoryId, siteId] = siteCode.split("-");
                    const siteCodeStr = layers.find(l => l.category.id == Number(categoryId))?.sites.find(s => s.id == Number(siteId))?.code;
                    const res = await api.get(`/data/category/${categoryId}/by-site/${siteCodeStr}`, authHeader(""));
                    newInfo[siteCode] = res.data.data;
                }
            }

            setInfoValues(newInfo);
        };

        fetchData();
    }, [variables]);
};

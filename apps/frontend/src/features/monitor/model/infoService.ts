import Variable from "@/entites/variable/types/variable";
import { api } from "@/shared/model/api/instance";
import { useAuth } from "@/shared/model/auth";
import { authHeader } from "@/shared/model/utils";
import { ApiResponse, GroupedData } from "@/types";
import { useInfoStore } from "./useInfoStore";

const fetchVariables = async (categoryId: number) => {

    const { token } = useAuth.getState();
    const { setInfoVariables } = useInfoStore.getState();

    await api.get<ApiResponse<Variable[]>>(`/data/category/${categoryId}/variables`, authHeader(token))
        .then(res => {
            setInfoVariables(res.data.data);
        });
};

const fetchData = async (categoryId: number, siteCode: string) => {

    const { token } = useAuth.getState();
    const { setInfoData } = useInfoStore.getState();

    await api.get<ApiResponse<GroupedData[]>>(`/data/category/${categoryId}/by-site/${siteCode}`, authHeader(token))
        .then(res => {
            setInfoData(res.data.data);
        });
}

export {
    fetchVariables,
    fetchData
}
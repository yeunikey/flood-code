import DataSource from "@/entites/source/types/sources";
import { api } from "@/shared/model/api/instance";
import { useAuth } from "@/shared/model/auth";
import { ApiResponse } from "@/types";
import { toast } from "react-toastify";
import { useSourceModal } from "../modal/useSourceModal";
import { useSources } from "@/entites/source/model/useSource";
import { useImportStore } from "../useImportStore";

const fetchSources = async () => {

    const { token } = useAuth.getState();
    const { setSources, setLoading } = useSources.getState();

    await api.get<ApiResponse<DataSource[]>>("/metadata/sources", {
        headers: { Authorization: "Bearer " + token },
    })
        .then(({ data }) => {
            setSources(data.data)
        })
        .finally(() => {
            setLoading(false);
        });
}

const handleCreateSource = async (
    fetching: boolean,
    setFetching: (fetching: boolean) => void,

    name: string,
) => {

    const { token } = useAuth.getState();
    const { setOpen } = useSourceModal.getState();

    const { sources, setSources } = useSources.getState();
    const { setSelectedSource } = useImportStore.getState();

    if (fetching) {
        toast.warning('Ожидайте ответа')
        return;
    }

    if (name == "") {
        toast.error('Заполните все поля')
        return;
    }

    setFetching(true);

    const body = {
        name,
    };

    await api.post<ApiResponse<DataSource>>('/metadata/sources', body,
        {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(({ data }) => {

            if (data.statusCode != 200) {
                toast.error(data.message);
            }

            toast.success('Успешно создано!')

            const newSources = sources;
            newSources.push(data.data);
            setSources(newSources);

            setSelectedSource(data.data);

            setOpen(false);
        });
}

export {
    handleCreateSource, fetchSources
}
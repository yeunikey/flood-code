import { useLayers } from "@/entites/layer/model/useLayers";
import Layer from "@/entites/layer/types/layer";
import { api } from "@/shared/model/api/instance";
import { useAuth } from "@/shared/model/auth"
import { ApiResponse } from "@/types";
import { useLayersStore } from "./useLayersStore";

const fetchLayers = async () => {

    const { token } = useAuth.getState();
    const { setLayers, setLoading } = useLayers.getState();

    await api.get<ApiResponse<Layer[]>>('/data/categories/sites', {
        headers: { Authorization: 'Bearer ' + token }
    })
        .then(({ data }) => {
            setLayers(data.data);
        }).finally(() => {
            setLoading(false);
        });

}

const handleEnableAll = () => {

    const { layers } = useLayers.getState();
    const { setSelectedSites } = useLayersStore.getState();

    const newSelected: Record<string, boolean> = {};
    for (const layer of layers) {
        for (const site of layer.sites) {
            const key = `${layer.category.id}-${site.id}`;
            newSelected[key] = true;
        }
    }
    setSelectedSites(newSelected);
};

const handleDisableAll = () => {
    const { setSelectedSites } = useLayersStore.getState();
    setSelectedSites({});
};

const enableCategory = (categoryId: number, siteCodes: string[]) => {
    const { layers } = useLayers.getState();
    const { selectedSites, setSelectedSites } = useLayersStore.getState();

    const layer = layers.find(l => l.category.id === categoryId);
    if (!layer) return;

    const updated = { ...selectedSites };

    layer.sites
        .filter(s => siteCodes.includes(s.code))
        .forEach(site => {
            const key = `${categoryId}-${site.id}`;
            updated[key] = true;
        });

    setSelectedSites(updated);
};

/** Выключить (удалить из selectedSites) все сайты категории ТОЛЬКО из указанного бассейна */
const disableCategory = (categoryId: number, siteCodes: string[]) => {
    const { layers } = useLayers.getState();
    const { selectedSites, setSelectedSites } = useLayersStore.getState();

    const layer = layers.find(l => l.category.id === categoryId);
    if (!layer) return;

    // ids сайтов в этой категории, которые принадлежат бассейну
    const idsToDisable = new Set(
        layer.sites
            .filter(s => siteCodes.includes(s.code))
            .map(s => s.id)
    );

    const updated: Record<string, boolean> = {};
    for (const [key, val] of Object.entries(selectedSites)) {
        const [catStr, siteIdStr] = key.split("-");
        const cat = Number(catStr);
        const siteId = Number(siteIdStr);

        // удаляем только совпавшие по категории и id сайта
        if (cat === categoryId && idsToDisable.has(siteId)) continue;

        updated[key] = val;
    }

    setSelectedSites(updated);
};

const enableOthers = (layers: Layer[]) => {
    for (const l of layers) {
        enableCategory(l.category.id, l.sites.map(s => s.code))
    }
}

const disableOthers = (layers: Layer[]) => {
    for (const l of layers) {
        disableCategory(l.category.id, l.sites.map(s => s.code))
    }
}


export {
    fetchLayers,
    handleEnableAll,
    handleDisableAll,
    enableCategory,
    disableCategory,

    enableOthers,
    disableOthers
};
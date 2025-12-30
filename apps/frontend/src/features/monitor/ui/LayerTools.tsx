'use client';

import { Button, Divider, TextField, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useState, useMemo } from "react";
import { handleDisableAll, handleEnableAll } from "../model/layerService";
import { useLayers } from "@/entites/layer/model/useLayers";
import { useMap } from "../model/useMap";
import { useLayersStore } from "../model/useLayersStore";
import { fetchData, fetchVariables } from "../model/infoService";

function LayerSearch() {
    const { layers } = useLayers();
    const { setSelectedSite } = useLayersStore();
    const { map } = useMap();

    const [search, setSearch] = useState("");

    const sitesArray = useMemo(() => layers.flatMap(layer => layer.sites), [layers]);

    const filteredSites = useMemo(() => {
        if (!search) return [];
        return sitesArray
            .filter(site => site.name.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 10);
    }, [search, sitesArray]);

    const handleTeleport = (site: typeof sitesArray[0]) => {
        if (!map) return;

        setSelectedSite(site);

        const layer = layers.find(l => l.sites.some(s => s.code === site.code));

        if (layer) {
            const categoryId = layer.category.id;
            fetchVariables(categoryId);
            fetchData(categoryId, site.code);
        }

        map.flyTo({
            center: [site.longtitude, site.latitude],
            zoom: 15,
            essential: true,
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="px-3 flex flex-col gap-3">
                <TextField
                    label="Поиск по названию сайта..."
                    variant="outlined"
                    size="small"
                    className="w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="flex gap-2">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        fullWidth
                        onClick={() => handleEnableAll()}
                        disableElevation
                    >
                        Вкл. все
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        fullWidth
                        onClick={() => handleDisableAll()}
                        disableElevation
                    >
                        Выкл. все
                    </Button>
                </div>

                {filteredSites.length > 0 && (
                    <List dense className="max-h-40 overflow-y-auto border border-gray-200 rounded mt-1">
                        {filteredSites.map(site => (
                            <ListItem key={site.id} disablePadding>
                                <ListItemButton onClick={() => handleTeleport(site)}>
                                    <ListItemText primary={site.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </div>

            <Divider sx={{ my: 1 }} />
        </div>
    );
}

export default LayerSearch;

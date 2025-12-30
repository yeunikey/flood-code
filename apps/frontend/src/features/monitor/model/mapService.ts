import { useLayers } from "@/entites/layer/model/useLayers";
import { useLayersStore } from "./useLayersStore";
import { useMap } from "./useMap";
import mapboxgl, { Marker } from "mapbox-gl";
import { useInfoStore } from "./useInfoStore";

const generateColorFromId = (id: number) => {
    const hue = (id * 137.508) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

const renderMarkers = async (
    markerRefs: React.RefObject<Marker[]>
) => {

    const { map } = useMap.getState();
    const { getActiveSiteIdsByCategory, setSelectedSite } = useLayersStore.getState();
    const { layers } = useLayers.getState();

    const { setSite, setCategory } = useInfoStore.getState();

    if (!map) return;

    const activeSitesByCategory = getActiveSiteIdsByCategory();

    console.log(activeSitesByCategory)

    const addMarkers = () => {
        markerRefs.current.forEach(marker => marker.remove());
        markerRefs.current = [];

        // Итерируем категории
        for (const [categoryIdStr, siteIds] of Object.entries(activeSitesByCategory)) {
            const categoryId = Number(categoryIdStr);
            const color = generateColorFromId(categoryId) || '#007bff';

            const layer = layers.find(l => l.category.id === categoryId);
            if (!layer) continue;

            for (const siteId of siteIds) {

                const site = layer.sites.find(s => s.id === siteId);
                if (!site) continue;

                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.id = `marker-${siteId}`;

                el.style.width = '20px';
                el.style.height = '20px';
                el.style.backgroundColor = color;
                el.style.border = '3px solid white';
                el.style.borderRadius = '50%';
                el.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)';
                el.style.cursor = 'pointer';
                el.style.zIndex = '1000';

                el.onclick = () => {
                    setSelectedSite(site);

                    setSite(site);
                    setCategory(layers.find(c => c.category.id == Number(categoryIdStr))?.category ?? null)
                    console.log({ site, test: layers.find(c => c.category.id == Number(categoryIdStr))?.category ?? null })
                };

                const marker = new mapboxgl.Marker({ element: el })
                    .setLngLat([site.longtitude, site.latitude])
                    .setPopup(new mapboxgl.Popup().setText(site.name))
                    .addTo(map);

                markerRefs.current.push(marker);
            }
        }
    };

    if (!map.isStyleLoaded()) {
        map.once('load', addMarkers);
    } else {
        addMarkers();
    }

    return () => {
        markerRefs.current.forEach(marker => marker.remove());
        markerRefs.current = [];
    };
}

export {
    renderMarkers
}
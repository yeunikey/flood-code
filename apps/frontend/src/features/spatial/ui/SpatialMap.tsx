/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSpatialMap } from "../model/useSpatialMap";
import mapboxgl, { ExpressionSpecification } from "mapbox-gl";
import { useSpatialStore } from "../model/useSpatialStore";

mapboxgl.accessToken = 'pk.eyJ1IjoieWV1bmlrZXkiLCJhIjoiY205cjdpbTV5MWxyazJpc2FiMWZ3NnVjaSJ9.Fm89p6MOyo_GqvT4uEXpeQ';

function SpatialMap() {

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const { setMap, loading } = useSpatialMap();
    const { selectedTile } = useSpatialStore();

    const [legend, setLegend] = useState<
        { color: string; value: number | string }[]
    >([]);

    useEffect(() => {
        if (!mapContainer.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [84, 49],
            zoom: 10,
            attributionControl: false,
            logoPosition: 'bottom-right',
        });

        mapRef.current.addControl(new mapboxgl.ScaleControl());

        setMap(mapRef.current);

        return () => {
            mapRef.current?.remove();
        };

    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !selectedTile?.id) return;

        const loadLayer = async () => {

            map.getStyle().layers?.forEach((layer) => {
                if (layer.id.startsWith("tile-layer-") && map.getLayer(layer.id)) {
                    map.removeLayer(layer.id);
                }
            });

            Object.keys(map.getStyle().sources).forEach((sourceId) => {
                if (sourceId.startsWith("tile-source-") && map.getSource(sourceId)) {
                    map.removeSource(sourceId);
                }
            });

            const sourceId = `tile-source-${selectedTile.id}`;
            const tileUrl = `https://tileserver.flood.astanait.edu.kz/data/${selectedTile.id}/{z}/{x}/{y}.pbf`;
            const tileJSONUrl = `https://tileserver.flood.astanait.edu.kz/data/${selectedTile.id}.json`;

            try {
                const res = await fetch(tileJSONUrl);
                const data = await res.json();

                const sourceLayerName = data.vector_layers?.[0]?.id;
                if (!sourceLayerName) {
                    console.error("Не удалось получить source-layer из TileJSON");
                    return;
                }

                const attributeInfo = data.tilestats.layers[0].attributes.find(
                    (attr: any) => attr.attribute === selectedTile.selectedVariable
                );
                const minValue = attributeInfo?.min ?? 0;
                const maxValue = attributeInfo?.max ?? 1;

                // Добавляем источник
                map.addSource(sourceId, {
                    type: "vector",
                    tiles: [tileUrl],
                    minzoom: 0,
                    maxzoom: 14,
                });

                // Если solid, создаём один слой как обычно
                if (selectedTile.colorMode === 'solid') {
                    const layerType = data.vector_layers[0].geometry === "Polygon" ? "fill" : "line";
                    const paint = layerType === "fill"
                        ? { "fill-color": selectedTile.solidColor || "#1976D2", "fill-opacity": 0.3 }
                        : { "line-color": selectedTile.solidColor || "#1976D2", "line-width": 1 };

                    map.addLayer({
                        id: `tile-layer-${selectedTile.id}`,
                        type: layerType,
                        source: sourceId,
                        "source-layer": sourceLayerName,
                        paint,
                    });
                }
                // Если gradient, создаём два слоя: fill и line
                else if (selectedTile.colorMode === 'gradient') {
                    const variable = selectedTile.selectedVariable;

                    // Пропускаем, если переменная не выбрана
                    if (!variable) return;

                    const colorA = selectedTile.gradientColorA || "#00f";
                    const colorB = selectedTile.gradientColorB || "#f00";

                    const colorExpr: ExpressionSpecification = [
                        'interpolate',
                        ['linear'],
                        ['get', variable],
                        minValue, colorA,
                        maxValue, colorB
                    ];

                    const fillLayerId = `tile-layer-fill-${selectedTile.id}`;

                    map.addLayer({
                        id: fillLayerId,
                        type: "fill",
                        source: sourceId,
                        "source-layer": sourceLayerName,
                        paint: {
                            "fill-color": colorExpr,
                            "fill-opacity": 0.6
                        },
                        filter: ["has", variable]
                    });

                    const popup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false
                    });

                    map.on("mousemove", fillLayerId, e => {
                        map.getCanvas().style.cursor = "pointer";
                        const coords = e.lngLat;
                        const props = e.features?.[0]?.properties || {};
                        const value = props[variable];

                        if (value === undefined || value === null) {
                            popup.remove();
                            return;
                        }

                        popup
                            .setLngLat(coords)
                            .setHTML(`<strong>${variable}:</strong> ${value}`)
                            .addTo(map);
                    });

                    map.on("mouseleave", fillLayerId, () => {
                        map.getCanvas().style.cursor = "";
                        popup.remove();
                    });

                    // Легенда

                    // === Генерация легенды ===
                    const steps = 6;
                    const step = (maxValue - minValue) / (steps - 1);
                    const legendItems = Array.from({ length: steps }, (_, i) => {
                        const value = minValue + i * step;
                        // интерполяция цвета между A и B
                        const interpolateColor = (t: number) => {
                            const a = parseInt(colorA.slice(1), 16);
                            const b = parseInt(colorB.slice(1), 16);
                            const ar = (a >> 16) & 0xff,
                                ag = (a >> 8) & 0xff,
                                ab = a & 0xff;
                            const br = (b >> 16) & 0xff,
                                bg = (b >> 8) & 0xff,
                                bb = b & 0xff;
                            const r = Math.round(ar + (br - ar) * t);
                            const g = Math.round(ag + (bg - ag) * t);
                            const bl = Math.round(ab + (bb - ab) * t);
                            return `rgb(${r},${g},${bl})`;
                        };
                        const color = interpolateColor(i / (steps - 1));
                        return { color, value: value.toFixed(2) };
                    });

                    setLegend(legendItems);

                }

            } catch (err) {
                console.error("Ошибка загрузки TileJSON:", err);
            }
        };

        loadLayer();
    }, [selectedTile]);




    return (
        <div className='grow relative'>
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 10,
                        bgcolor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress color="primary" />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Загрузка карты...
                        </Typography>
                    </Box>
                </Box>
            )}

            <div ref={mapContainer} className='w-full h-full' />

            {/* === Легенда === */}
            {legend.length > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        p: 2,
                        bgcolor: "rgba(255,255,255,0.9)",
                        borderRadius: 2,
                        boxShadow: 2,
                        zIndex: 20,
                        minWidth: 160,
                    }}
                >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {selectedTile?.selectedVariable}
                    </Typography>

                    {legend.map((item, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                                gap: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 0.5,
                                    backgroundColor: item.color,
                                    border: "1px solid #aaa",
                                }}
                            />
                            <Typography variant="body2">{item.value}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </div>
    );
}

export default SpatialMap;
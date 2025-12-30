'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import { useEffect, useRef } from 'react';

import { FeatureCollection } from 'geojson';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import mapboxgl from 'mapbox-gl';
import { renderMarkers } from '../model/mapService';
import { useLayerVisibility } from '@/entites/layer/model/usePublicLayers';
import { useLayersStore } from '../model/useLayersStore';
import { useMap } from '@/features/monitor/model/useMap';
import { usePools } from '../model/usePools';

mapboxgl.accessToken = 'pk.eyJ1IjoieWV1bmlrZXkiLCJhIjoiY205cjdpbTV5MWxyazJpc2FiMWZ3NnVjaSJ9.Fm89p6MOyo_GqvT4uEXpeQ';

const LayerMap = () => {

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const { layerStates } = useLayerVisibility();

    const { map, setMap, loading } = useMap();
    const { setInfoCollapse, infoCollapse, selectedSites, selectedSite } = useLayersStore();
    const markerRefs = useRef<mapboxgl.Marker[]>([]);

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
        renderMarkers(markerRefs)
    }, [map, selectedSites]);

    useEffect(() => {
        if (!mapRef.current) return;

        const interval = setInterval(() => {
            mapRef.current?.resize();
        }, 1);

        const timeout = setTimeout(() => {
            clearInterval(interval);
        }, 300);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [map, infoCollapse, selectedSite]);

    const { pools } = usePools();

    useEffect(() => {
        if (!map) return;

        const poolLayerPrefix = 'pool-';

        const updatePoolsLayers = async () => {
            const { pools } = usePools.getState();

            // Сначала удаляем все существующие слои бассейнов
            pools.forEach(pool => {
                const layerId = poolLayerPrefix + pool.name;
                const sourceId = layerId + '-source';
                if (map.getLayer(layerId)) map.removeLayer(layerId);
                if (map.getSource(sourceId)) map.removeSource(sourceId);
            });

            // Добавляем только видимые бассейны
            for (const pool of pools) {
                if (!pool.visible) continue;

                const layerId = poolLayerPrefix + pool.name;
                const sourceId = layerId + '-source';

                try {
                    const res = await fetch(`/pools/${pool.file}`);
                    const data: FeatureCollection = await res.json();

                    if (!map.getSource(sourceId)) {
                        map.addSource(sourceId, { type: 'geojson', data });
                    }

                    if (!map.getLayer(layerId)) {
                        map.addLayer({
                            id: layerId,
                            type: 'line',
                            source: sourceId,
                            paint: {
                                'line-color': '#FF9900', // оранжевый цвет
                                'line-width': 2,
                            },
                        });
                    }

                } catch (err) {
                    console.error(`Ошибка загрузки бассейна ${pool.name}:`, err);
                }
            }
        };

        if (map.isStyleLoaded()) {
            updatePoolsLayers();
        } else {
            map.once('load', updatePoolsLayers);
        }

    }, [map, pools]);


    useEffect(() => {
        if (!map) return;

        const regionLayerId = 'regions-outline';
        const regionSourceId = 'regions';
        const watersFillId = 'waters-fill';
        const watersOutlineId = 'waters-outline';
        const watersSourceId = 'waters';
        const watersSource1Id = 'waters1';

        const loadRegions = async () => {
            try {
                const res = await fetch('/geojson/regions.geojson');
                const data: FeatureCollection = await res.json();

                if (!map.getSource(regionSourceId)) map.addSource(regionSourceId, { type: 'geojson', data });
                if (!map.getLayer(regionLayerId)) {
                    map.addLayer({
                        id: regionLayerId,
                        type: 'line',
                        source: regionSourceId,
                        paint: { 'line-color': '#ffffff', 'line-width': 1.5 },
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };

        const loadWaters = async () => {
            try {
                const res = await fetch('/geojson/waters_relations.geojson');
                const data: FeatureCollection = await res.json();
                if (!map.getSource(watersSourceId)) map.addSource(watersSourceId, { type: 'geojson', data });
                if (!map.getLayer(watersFillId)) {
                    map.addLayer({
                        id: watersFillId,
                        type: 'fill',
                        source: watersSourceId,
                        paint: { 'fill-color': '#31A3F5', 'fill-opacity': 0.5 },
                    });
                }

                const res2 = await fetch('/geojson/waters_ways.geojson');
                const data2: FeatureCollection = await res2.json();
                if (!map.getSource(watersSource1Id)) map.addSource(watersSource1Id, { type: 'geojson', data: data2 });
                if (!map.getLayer(watersOutlineId)) {
                    map.addLayer({
                        id: watersOutlineId,
                        type: 'line',
                        source: watersSource1Id,
                        paint: { 'line-color': '#31A3F5', 'line-width': 1.5 },
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };


        const removeLayerIfExists = (layerId: string, sourceId: string) => {
            if (map.getLayer(layerId)) map.removeLayer(layerId);
            if (map.getSource(sourceId)) map.removeSource(sourceId);
        };

        if (map.isStyleLoaded()) {
            if (layerStates.regionBorders) loadRegions();
            else removeLayerIfExists(regionLayerId, regionSourceId);

            if (layerStates.lakesRivers) loadWaters();
            else {
                removeLayerIfExists(watersFillId, watersSourceId);
                removeLayerIfExists(watersOutlineId, watersSource1Id);
            }
        } else {
            map.once('load', () => {
                if (layerStates.regionBorders) loadRegions();
                if (layerStates.lakesRivers) loadWaters();
            });
        }

    }, [map, layerStates.regionBorders, layerStates.lakesRivers]);


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

            <div className="absolute z-[100] top-3 left-3">
                <Tooltip title="Показать уровни">
                    <IconButton
                        sx={{
                            backgroundColor: 'white',
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                            boxShadow: 1,
                        }}
                        size="small"
                        onClick={() => setInfoCollapse(!infoCollapse)}
                    >
                        {infoCollapse ? <CloseIcon /> : <InfoOutlinedIcon />}
                    </IconButton>
                </Tooltip>
            </div>

            <div ref={mapContainer} className='w-full h-full' />
        </div>
    );
};

export default LayerMap;

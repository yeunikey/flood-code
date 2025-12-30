import {
    Box,
    Button,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    styled,
    Switch,
    Typography,
    Zoom,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { disableCategory, disableOthers, enableCategory, enableOthers, fetchLayers } from "../model/layerService";
import { useEffect, useState } from "react";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import { useLayers } from "@/entites/layer/model/useLayers";
import { useLayersStore } from "../model/useLayersStore";
import { usePools } from "../model/usePools";
import InfoIcon from '@mui/icons-material/Info';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

function LayerItems() {
    const { layers } = useLayers();
    const { pools, togglePoolVisibility } = usePools();
    const { selectedSites, toggleSite } = useLayersStore();
    const [expanded, setExpanded] = useState<string[]>([]);

    const toggleExpand = (id: string) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        console.log(layers)
    }, [layers])

    useEffect(() => {
        fetchLayers();
    }, []);

    const handlePoolToggleAll = (pool: typeof pools[number], enable: boolean) => {
        layers.forEach(layer => {
            layer.sites
                .filter(site => pool.site_codes.includes(site.code))
                .forEach(site => {
                    const key = `${layer.category.id}-${site.id}`;
                    const isSelected = !!selectedSites[key];
                    if (enable && !isSelected) toggleSite(key);
                    if (!enable && isSelected) toggleSite(key);
                });
        });
    };

    const allPoolSiteCodes = pools.flatMap(pool => pool.site_codes);

    const otherLayers = layers
        .map(layer => ({
            ...layer,
            sites: layer.sites.filter(site => !allPoolSiteCodes.includes(site.code))
        }))
        .filter(layer => layer.sites.length > 0);

    const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

    const handleTooltipToggle = (id: string) => {
        setActiveTooltipId(prev => (prev === id ? null : id));
    };

    return (
        <List dense>
            {pools
                .filter(pool => layers.some(layer => layer.sites.some(site => pool.site_codes.includes(site.code))))
                .map((pool, i) => {
                    const poolLayers = layers.filter(layer =>
                        layer.sites.some(site => pool.site_codes.includes(site.code))
                    );

                    return (
                        <Zoom
                            in={true}
                            timeout={500}
                            style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                            key={pool.name}
                        >
                            <div>
                                <ListItemButton onClick={() => toggleExpand(`pool-${pool.name}`)}>
                                    <ListItemText
                                        primary={<Typography fontWeight={600}>{pool.name}</Typography>}
                                        secondary={"Бассейн"}
                                    />
                                    {expanded.includes(`pool-${pool.name}`) ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>

                                <Collapse in={expanded.includes(`pool-${pool.name}`)} timeout="auto" unmountOnExit>
                                    <ListItem sx={{ pl: 4 }}>
                                        <ListItemText primary={<Typography variant="body2">Отобразить границы</Typography>} />
                                        <Switch
                                            edge="end"
                                            checked={pool.visible}
                                            onChange={() => togglePoolVisibility(pool.name)}
                                        />
                                    </ListItem>
                                    <div className="flex gap-2 ps-4 pe-3 pt-2 pb-2">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            fullWidth
                                            onClick={() => handlePoolToggleAll(pool, true)}
                                        >
                                            Вкл. все
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            fullWidth
                                            onClick={() => handlePoolToggleAll(pool, false)}
                                        >
                                            Выкл. все
                                        </Button>
                                    </div>

                                    {poolLayers.map(layer => (
                                        <div key={layer.category.id}>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={() => toggleExpand(`cat-${layer.category.id}`)}
                                            >
                                                <ListItemText
                                                    primary={<Typography fontWeight={500}>{layer.category.name}</Typography>}
                                                    secondary={layer.category.description}
                                                />
                                                {expanded.includes(`cat-${layer.category.id}`) ? <ExpandLess /> : <ExpandMore />}
                                            </ListItemButton>

                                            <Collapse in={expanded.includes(`cat-${layer.category.id}`)} timeout="auto" unmountOnExit>
                                                <div className="flex gap-2 ps-8 pe-3 pt-3 pb-3">
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="small"
                                                        fullWidth
                                                        onClick={() => enableCategory(layer.category.id, pool.site_codes)}
                                                    >
                                                        Вкл. все
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        fullWidth
                                                        onClick={() => disableCategory(layer.category.id, pool.site_codes)}
                                                    >
                                                        Выкл. все
                                                    </Button>
                                                </div>

                                                <List component="div" disablePadding>
                                                    {layer.sites
                                                        .filter(site => pool.site_codes.includes(site.code))
                                                        .sort((a, b) => a.name.localeCompare(b.name))
                                                        .map(site => {
                                                            const key = `${layer.category.id}-${site.id}`;
                                                            return (
                                                                <ListItem
                                                                    key={key}
                                                                    sx={{ pl: 8 }}
                                                                    secondaryAction={
                                                                        <Box display="flex" alignItems="center">
                                                                            <LightTooltip
                                                                                open={activeTooltipId === key}
                                                                                onClose={() => setActiveTooltipId(null)}
                                                                                placement="top"
                                                                                title={
                                                                                    <div className="p-2 w-64 flex flex-col gap-3">
                                                                                        <div>
                                                                                            <Typography fontWeight={500} fontSize={18} >{site.name}</Typography>
                                                                                            <Typography color="textDisabled" fontSize={14}>{site.siteType.name}</Typography>
                                                                                        </div>

                                                                                        <Divider orientation="horizontal" />

                                                                                        <div className="space-y-1">
                                                                                            <div className="flex justify-between">
                                                                                                <Typography color="textDisabled" fontSize={14}>Код</Typography>
                                                                                                <Typography fontSize={14}>{site.code}</Typography>
                                                                                            </div>
                                                                                            <div className="flex justify-between">
                                                                                                <Typography color="textDisabled" fontSize={14}>Широта</Typography>
                                                                                                <Typography fontSize={14}>{site.latitude.toFixed(7)}</Typography>
                                                                                            </div>
                                                                                            <div className="flex justify-between">
                                                                                                <Typography color="textDisabled" fontSize={14}>Долгота</Typography>
                                                                                                <Typography fontSize={14}>{site.longtitude.toFixed(7)}</Typography>
                                                                                            </div>
                                                                                            <div className="flex justify-between">
                                                                                                <Typography color="textDisabled" fontSize={14}>Бассейн</Typography>
                                                                                                <Typography fontSize={14} className="w-32 text-end">{pool.name}</Typography>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                disableFocusListener disableTouchListener
                                                                            >
                                                                                <IconButton aria-label="info" onClick={() => handleTooltipToggle(key)}>
                                                                                    <InfoIcon />
                                                                                </IconButton>
                                                                            </LightTooltip>

                                                                            <Switch
                                                                                edge="end"
                                                                                checked={!!selectedSites[key]}
                                                                                onChange={() => toggleSite(key)}
                                                                            />
                                                                        </Box>
                                                                    }
                                                                >
                                                                    <ListItemText
                                                                        primary={<Typography fontSize="14px" fontWeight={500} className="w-36">{site.name}</Typography>}
                                                                        secondary={site.siteType.name}
                                                                    />
                                                                </ListItem>
                                                            );
                                                        })}
                                                </List>
                                            </Collapse>
                                            <Divider sx={{ my: 1 }} />
                                        </div>
                                    ))}
                                </Collapse>

                                <Divider sx={{ my: 1 }} />
                            </div>
                        </Zoom >
                    );
                })}

            {/* Другие данные */}
            {otherLayers.length > 0 && (
                <Zoom in={true} timeout={500} style={{ transitionDelay: `${(pools.length + 1) * 100}ms` }}>
                    <div>
                        <ListItemButton onClick={() => toggleExpand("other")}>
                            <ListItemText
                                primary={<Typography fontWeight={600}>Другое</Typography>}
                                secondary="Сайты, не входящие в бассейны"
                            />
                            {expanded.includes("other") ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={expanded.includes("other")} timeout="auto" unmountOnExit>

                            <div className="flex gap-2 ps-4 pe-3 pt-2 pb-2">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    fullWidth
                                    onClick={() => enableOthers(otherLayers)}
                                >
                                    Вкл. все
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    fullWidth
                                    onClick={() => disableOthers(otherLayers)}
                                >
                                    Выкл. все
                                </Button>
                            </div>

                            {otherLayers.map(layer => (
                                <div key={layer.category.id}>
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => toggleExpand(`other-cat-${layer.category.id}`)}>
                                        <ListItemText
                                            primary={<Typography fontWeight={500}>{layer.category.name}</Typography>}
                                            secondary={layer.category.description}
                                        />
                                        {expanded.includes(`other-cat-${layer.category.id}`) ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>

                                    <Collapse in={expanded.includes(`other-cat-${layer.category.id}`)} timeout="auto" unmountOnExit>

                                        <div className="flex gap-2 ps-8 pe-3 pt-3 pb-3">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                fullWidth
                                                onClick={() => enableCategory(layer.category.id, layer.sites.map(s => s.code))}
                                            >
                                                Вкл. все
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                fullWidth
                                                onClick={() => disableCategory(layer.category.id, layer.sites.map(s => s.code))}
                                            >
                                                Выкл. все
                                            </Button>
                                        </div>

                                        <List component="div" disablePadding>
                                            {layer.sites.map(site => {
                                                const key = `${layer.category.id}-${site.id}`;
                                                return (
                                                    <ListItem
                                                        key={key}
                                                        sx={{ pl: 8 }}
                                                        secondaryAction={
                                                            <Box display="flex" alignItems="center">
                                                                <LightTooltip
                                                                    open={activeTooltipId === key}
                                                                    onClose={() => setActiveTooltipId(null)}
                                                                    placement="top"
                                                                    title={
                                                                        <div className="p-2 w-64 flex flex-col gap-3">
                                                                            <div>
                                                                                <Typography fontWeight={500} fontSize={18} >{site.name}</Typography>
                                                                                <Typography color="textDisabled" fontSize={14}>{site.siteType.name}</Typography>
                                                                            </div>

                                                                            <Divider orientation="horizontal" />

                                                                            <div className="space-y-1">
                                                                                <div className="flex justify-between">
                                                                                    <Typography color="textDisabled" fontSize={14}>Код</Typography>
                                                                                    <Typography fontSize={14}>{site.code}</Typography>
                                                                                </div>
                                                                                <div className="flex justify-between">
                                                                                    <Typography color="textDisabled" fontSize={14}>Широта</Typography>
                                                                                    <Typography fontSize={14}>{site.latitude.toFixed(7)}</Typography>
                                                                                </div>
                                                                                <div className="flex justify-between">
                                                                                    <Typography color="textDisabled" fontSize={14}>Долгота</Typography>
                                                                                    <Typography fontSize={14}>{site.longtitude.toFixed(7)}</Typography>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    disableFocusListener disableTouchListener
                                                                >
                                                                    <IconButton aria-label="info" onClick={() => handleTooltipToggle(key)}>
                                                                        <InfoIcon />
                                                                    </IconButton>
                                                                </LightTooltip>

                                                                <Switch
                                                                    edge="end"
                                                                    checked={!!selectedSites[key]}
                                                                    onChange={() => toggleSite(key)}
                                                                />
                                                            </Box>
                                                        }
                                                    >
                                                        <ListItemText
                                                            primary={<Typography fontSize="14px" fontWeight={500} className="w-36">{site.name}</Typography>}
                                                            secondary={site.siteType.name}
                                                        />
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    </Collapse>
                                    <Divider sx={{ my: 1 }} />
                                </div>
                            ))}
                        </Collapse>
                        <Divider sx={{ my: 1 }} />
                    </div>
                </Zoom>
            )
            }
        </List >
    );
}

export default LayerItems;

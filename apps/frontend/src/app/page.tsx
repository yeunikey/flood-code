'use client'

import { Divider, Grid, List, ListItem, ListItemText, Switch, Tab, Tabs, Typography } from "@mui/material";

import InfoCollapse from "@/features/monitor/ui/InfoCollapse";
import LayerInfo from "@/features/monitor/ui/LayerInfo";
import LayerItems from "@/features/monitor/ui/LayerItems";
import LayerMap from "@/features/monitor/ui/LayerMap";
import LayerSearch from "@/features/monitor/ui/LayerTools";
import View from "@/shared/ui/View";
import { useLayerVisibility } from "@/entites/layer/model/usePublicLayers";
import { useState } from "react";

function LayersPage() {
    const [tabValue, setTabValue] = useState(0);

    const { layerStates, toggleLayer } = useLayerVisibility();

    return (
        <View links={["Паводки", "Мониторинг"]} className="relative h-[calc(100dvh-122px)] w-full">

            <Grid container>
                <Grid size={2} className="h-[calc(100dvh-122px)] overflow-y-scroll py-6 flex flex-col">
                    <LayerSearch />

                    <Tabs
                        value={tabValue}
                        onChange={(_, v) => setTabValue(v)}
                        variant="fullWidth"
                    >
                        <Tab label="Публич. слои" />
                        <Tab label="Польз. слои" />
                    </Tabs>

                    <div>
                        {tabValue === 0 && (
                            <div className="flex flex-col py-2 gap-3">
                                <List component="div" disablePadding>
                                    <ListItem
                                        key={'lakesRivers'}
                                        secondaryAction={
                                            <Switch
                                                edge="end"
                                                checked={layerStates.lakesRivers}
                                                onChange={() => toggleLayer('lakesRivers')}
                                            />
                                        }
                                    >

                                        <ListItemText
                                            primary={
                                                <Typography fontSize="16px" fontWeight={500}>Озёра и реки</Typography>
                                            }
                                            secondary='Слои'
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'regionBorders'}
                                        secondaryAction={
                                            <Switch
                                                edge="end"
                                                checked={layerStates.regionBorders}
                                                onChange={() => toggleLayer('regionBorders')}
                                            />
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography fontSize="16px" fontWeight={500}>Границы областей</Typography>
                                            }
                                            secondary='Слои'
                                        />
                                    </ListItem>
                                </List>

                                <Divider orientation="horizontal" />

                                <LayerItems />
                            </div>
                        )}

                        {tabValue === 1 && (
                            <div className="flex flex-col items-center gap-2 p-3">
                                {/* <Button
                                variant="outlined"
                                className="w-full"
                            >
                                <Add />
                            </Button> */}

                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    align="center"
                                    sx={{ px: 2 }}
                                    className="pt-6"
                                >
                                    У вас сейчас нет слоёв
                                </Typography>
                            </div>
                        )}
                    </div>
                </Grid>
                <Divider orientation="vertical" />

                {/* Правая панель */}
                <Grid size={"grow"} className="grow flex flex-col flex-1">
                    <div className="grow flex flex-1 min-w-0">
                        <InfoCollapse />
                        <LayerMap />
                    </div>

                    <Divider orientation="horizontal" />

                    <LayerInfo />
                </Grid>
            </Grid>
        </View>
    );
}

export default LayersPage;

'use client'

import { Collapse, Divider, IconButton, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { useLayersStore } from "../model/useLayersStore";
import CloseIcon from '@mui/icons-material/Close';
import LayerTable from "./info/LayerTable";
import { useState } from "react";
import TableRowsIcon from '@mui/icons-material/TableRows';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayerChart from "./info/LayerChart";

function LayerInfo() {

    const { selectedSite, setSelectedSite } = useLayersStore();

    const [value, setValue] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Collapse
            in={selectedSite != null}
            orientation="vertical"
            timeout={300}
            unmountOnExit>
            <div className="relative h-96">

                <Divider orientation="horizontal" />

                <div className="absolute z-[100] top-3 right-3">
                    <Tooltip title="Закрыть">
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
                            onClick={() => setSelectedSite(null)}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </div>

                <div className="h-full flex">
                    <div className="min-w-80 w-80 h-full p-6 bg-primary flex flex-col justify-between">
                        <div className="test">
                            <Typography variant="h4" fontWeight={600} color="white" className="line-clamp-3">
                                {selectedSite?.name}
                            </Typography>

                            <Typography variant="subtitle1" className="mt-2 text-gray-200">
                                {selectedSite?.siteType.name}
                            </Typography>
                        </div>

                        <div className="flex flex-col gap-6">
                            {selectedSite?.siteType.description && (
                                <Typography variant="body2" className="text-gray-300 leading-relaxed line-clamp-2">
                                    {selectedSite.siteType.description}
                                </Typography>
                            )}

                            <div className="text-gray-300 flex gap-2">
                                <div>
                                    ш: {selectedSite?.latitude.toFixed(6)},
                                </div>
                                <div>
                                    д: {selectedSite?.longtitude.toFixed(6)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex h-full flex-1 min-w-0">

                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                            className="min-w-36 w-36 py-3"
                        >
                            <Tab label="Таблица" icon={<TableRowsIcon />} iconPosition="start" aria-controls={`vertical-tabpanel-${0}`} />
                            <Tab label="Чарты" icon={<BarChartIcon />} iconPosition="start" aria-controls={`vertical-tabpanel-${1}`} />
                        </Tabs>

                        <div className="p-6 overflow-y-auto flex-1 min-w-0">
                            {value == 0 ? (
                                <LayerTable />
                            ) : (
                                <LayerChart />
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </Collapse >
    );
}

export default LayerInfo;
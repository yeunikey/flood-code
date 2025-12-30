'use client'

import { AnalyticVariable, useAnalyticStore } from "@/features/analytic/model/useAnalyticStore";
import { ApiResponse, GroupedData } from "@/types";
import { Button, Checkbox, Collapse, Divider, FormControlLabel, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Zoom } from "@mui/material";
import { Settings, ShowChart } from "@mui/icons-material";
import { fmt, pearson, spearman } from "@/features/analytic/corallation";
import { useEffect, useMemo, useState } from "react";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LayersList from "@/widgets/monitor/layers_list/LayersList";
import { LineChart } from "@mui/x-charts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TuneIcon from '@mui/icons-material/Tune';
import Variable from "@/entites/variable/types/variable";
import View from "@/shared/ui/View";
import { api } from "@/shared/model/api/instance";
import { authHeader } from "@/shared/model/utils";
import { useAuth } from "@/shared/model/auth";
import { useLayers } from "@/entites/layer/model/useLayers";
import { useLayersStore } from "@/features/monitor/model/useLayersStore";
import { toast } from "react-toastify";

function AnalyticPage() {

    const { token } = useAuth();
    const { selectedSites } = useLayersStore();
    const { layers } = useLayers();

    const {
        variables, setVariables,
        infoValues, setInfoValues,
        disabledVariables, toggleVariable,
        variableCollapse, setVariableCollapse,
    } = useAnalyticStore();


    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    const [globalMinDate, setGlobalMinDate] = useState<Date | null>(null);
    const [globalMaxDate, setGlobalMaxDate] = useState<Date | null>(null);
    useEffect(() => {
        const selectedCount = Object.values(selectedSites).filter(Boolean).length;
        if (selectedCount > 5) {
            toast.error('Объектов для сравнения не может быть больше 5');
            return;
        }

        const fetchDataForSites = async () => {
            const newVariables: Record<string, AnalyticVariable[]> = { ...variables };
            const newInfoValues: Record<string, GroupedData[]> = { ...infoValues };

            let globalMin: Date | null = null;
            let globalMax: Date | null = null;

            // Удаляем невыбранные сайты
            Object.keys(newVariables).forEach(siteCode => {
                if (!selectedSites[siteCode]) {
                    delete newVariables[siteCode];
                    delete newInfoValues[siteCode];
                }
            });

            for (const [siteCode, isSelected] of Object.entries(selectedSites)) {
                if (!isSelected) continue;

                const [categoryId, siteId] = siteCode.split("-");

                // 1️⃣ Загружаем переменные один раз, если их ещё нет
                if (!newVariables[siteCode]) {
                    try {
                        const varsRes = await api.get<ApiResponse<Variable[]>>(
                            `/data/category/${categoryId}/variables`,
                            authHeader(token)
                        );

                        newVariables[siteCode] = varsRes.data.data.map(v => ({
                            ...v,
                            categoryId: Number(categoryId),
                            siteId: Number(siteId),
                        }));
                    } catch (err) {
                        console.error(`Ошибка загрузки переменных для ${siteCode}`, err);
                        continue;
                    }
                }

                // 2️⃣ Загружаем значения по выбранному периоду
                try {
                    const siteCodeStr = layers.find(l => l.category.id == Number(categoryId))
                        ?.sites.find(s => s.id == Number(siteId))?.code;

                    if (!siteCodeStr) continue;

                    const infoRes = await api.get<ApiResponse<{
                        start: Date;
                        end: Date;
                        minDate: Date;
                        maxDate: Date;
                        total: number;
                        content: GroupedData[];
                    }>>(
                        `/data/category/${categoryId}/by-site/${siteCodeStr}/by-date`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            params: {
                                start: fromDate?.toISOString(),
                                end: toDate?.toISOString(),
                            },
                        }
                    );

                    const { content, minDate, maxDate, start, end } = infoRes.data.data;
                    newInfoValues[siteCode] = content;

                    if (!fromDate) setFromDate(new Date(start));
                    if (!toDate) setToDate(new Date(end));

                    if (minDate) {
                        const d = new Date(minDate);
                        if (!globalMin || d < globalMin) globalMin = d;
                    }
                    if (maxDate) {
                        const d = new Date(maxDate);
                        if (!globalMax || d > globalMax) globalMax = d;
                    }
                } catch (err) {
                    console.error(`Ошибка загрузки данных для ${siteCode}`, err);
                }
            }

            if (globalMin) setGlobalMinDate(globalMin);
            if (globalMax) setGlobalMaxDate(globalMax);

            setVariables(newVariables);
            setInfoValues(newInfoValues);
        };

        fetchDataForSites();
    }, [selectedSites, fromDate, toDate]);


    const allVariables = Object.values(variables).flat().map((v, index) => ({ ...v, index }));

    const allDates = useMemo(() => {
        const dates = new Set<number>();


        Object.values(infoValues)
            .flat()
            .forEach((item: GroupedData) => {
                if (item.group?.date_utc) {
                    dates.add(new Date(item.group.date_utc).getTime());
                }
            });

        return Array.from(dates).sort((a, b) => a - b).map(ts => new Date(ts));
    }, [infoValues]);

    const filteredDates = allDates.filter(date => {
        const time = new Date(date).getTime();
        return (!fromDate || time >= fromDate.getTime()) &&
            (!toDate || time <= toDate.getTime());
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedDates = filteredDates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const groupedVariables = allVariables.reduce((acc, variable) => {
        const categoryName = layers.find(l => l.category.id === variable.categoryId)?.category.name || 'Без категории';
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(variable);
        return acc;
    }, {} as Record<string, AnalyticVariable[]>);

    const visibleVariables = allVariables.filter(v => {
        const siteDisabled = disabledVariables[v.siteId] || [];
        return !siteDisabled.includes(v.id);
    });

    const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

    const valueIndex = useMemo(() => {
        const index: Record<string, Record<number, Record<number, number>>> = {};
        for (const [key, groups] of Object.entries(infoValues)) {
            index[key] = {};
            for (const g of groups) {
                for (const val of g.values) {
                    const varId = val.variable.id;
                    if (!index[key][varId]) index[key][varId] = {};
                    index[key][varId][new Date(g.group.date_utc).getTime()] = Number(val.value);
                }
            }
        }
        return index;
    }, [infoValues]);

    // xAxis -> time scale with Date objects (no strings)
    const chartXAxis = useMemo(
        () => [{
            scaleType: 'time' as const,
            data: filteredDates, // Date[]
            valueFormatter: (v: Date | number) => {
                const d = v instanceof Date ? v : new Date(v);
                return d.toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            },
        }],
        [filteredDates]
    );

    const [showDependencies, setShowDependencies] = useState(false);

    const dependencyRows = useMemo(() => {
        const rows: {
            index: number;
            variableName: string;
            sitesPair: string;
            spearmanRho: string;
            spearmanP: string;
            pearsonR: string;
            pearsonP: string;
        }[] = [];

        const varsMap: Record<number, { siteId: number; siteName: string; values: Record<number, number> }[]> = {};

        visibleVariables.forEach(v => {
            const siteName = layers.find(s => s.category.id === v.categoryId)?.sites.find(s => s.id === v.siteId)?.name || '-';
            const siteKey = `${v.categoryId}-${v.siteId}`;

            const valMap: Record<number, number> = {};
            infoValues[siteKey]?.forEach(group => {
                group.values.forEach(val => {
                    if (val.variable.id === v.id) {
                        const ts = new Date(group.group.date_utc).getTime();
                        if ((!fromDate || ts >= fromDate.getTime()) && (!toDate || ts <= toDate.getTime())) {
                            valMap[ts] = Number(val.value);
                        }
                    }
                });
            });

            if (!varsMap[v.id]) varsMap[v.id] = [];
            varsMap[v.id].push({ siteId: v.siteId, siteName, values: valMap });
        });

        let counter = 1;

        for (const [varId, siteEntries] of Object.entries(varsMap)) {
            if (siteEntries.length < 2) continue;

            for (let i = 0; i < siteEntries.length; i++) {
                for (let j = i + 1; j < siteEntries.length; j++) {
                    const a = siteEntries[i];
                    const b = siteEntries[j];

                    // 3. Находим общие даты
                    const commonDates = Object.keys(a.values)
                        .map(Number)
                        .filter(ts => ts in b.values)
                        .sort((x, y) => x - y);

                    const arrA = commonDates.map(ts => a.values[ts]);
                    const arrB = commonDates.map(ts => b.values[ts]);

                    let pear = { r: 0, p: 0 };
                    let spear = { rho: 0, p: 0 };
                    if (arrA.length > 1) {
                        pear = pearson(arrA, arrB);
                        spear = spearman(arrA, arrB);
                    }

                    rows.push({
                        index: counter++,
                        variableName: visibleVariables.find(v => v.id === Number(varId))?.name || '-',
                        sitesPair: `${a.siteName} | ${b.siteName}`,
                        spearmanRho: fmt(spear.rho),
                        spearmanP: fmt(spear.p),
                        pearsonR: fmt(pear.r),
                        pearsonP: fmt(pear.p)
                    });
                }
            }
        }

        return rows;
    }, [visibleVariables, infoValues, fromDate, toDate, layers]);

    function calcStats(values: (number | null)[]) {
        const nums = values.filter((v): v is number => v !== null);
        if (nums.length === 0) return null;

        const sorted = [...nums].sort((a, b) => a - b);
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;

        const std = Math.sqrt(
            nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / nums.length
        );

        const percentile = (p: number) => {
            const idx = (sorted.length - 1) * p;
            const lo = Math.floor(idx);
            const hi = Math.ceil(idx);
            return lo === hi
                ? sorted[lo]
                : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
        };

        return {
            mean,
            std,
            min: sorted[0],
            p25: percentile(0.25),
            p50: percentile(0.5),
            p75: percentile(0.75),
            max: sorted[sorted.length - 1],
        };
    }

    return (
        <View links={['Паводки', 'Аналитика']} className="h-[calc(100dvh-122px)] w-full flex">

            <Grid container sx={{ width: '100%' }}>
                <Grid size={2} className="overflow-y-scroll flex flex-col gap-3">
                    <LayersList />
                </Grid>

                <Divider orientation="vertical" />

                <Grid size="grow" className="h-[calc(100dvh-122px)] overflow-y-scroll grow flex flex-col p-4 relative">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <div className="flex justify-between">
                            <div className="flex gap-6">
                                <Button
                                    variant="outlined"
                                    startIcon={<TuneIcon />}
                                    onClick={() => setVariableCollapse(!variableCollapse)}
                                >
                                    Переменные
                                </Button>
                                <Divider orientation="vertical" />
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-3">
                                        <Typography color="textSecondary">от</Typography>
                                        <DatePicker
                                            label="дд.мм.гггг"
                                            value={fromDate}
                                            minDate={globalMinDate || undefined}
                                            maxDate={toDate || undefined}
                                            onChange={(newValue: Date | null) => { setFromDate(newValue); setPage(0); }}
                                            slotProps={{ textField: { size: 'small' } }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Typography color="textSecondary">до</Typography>
                                        <DatePicker
                                            label="дд.мм.гггг"
                                            value={toDate}
                                            minDate={fromDate || undefined}
                                            maxDate={globalMaxDate || undefined}
                                            onChange={(newValue: Date | null) => { setToDate(newValue); setPage(0); }}
                                            slotProps={{ textField: { size: 'small' } }}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant={viewMode === 'table' ? 'contained' : 'outlined'}
                                        onClick={() => setViewMode('table')}
                                    >
                                        Таблица
                                    </Button>
                                    <Button
                                        variant={viewMode === 'chart' ? 'contained' : 'outlined'}
                                        onClick={() => setViewMode('chart')}
                                    >
                                        График
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <IconButton color="primary"><Settings /></IconButton>
                                <Button
                                    variant="contained"
                                    startIcon={<ShowChart />}
                                    sx={{ bgcolor: "#1976d2" }}
                                    disableElevation
                                    onClick={() => setShowDependencies(!showDependencies)}
                                >
                                    Построить зависимости
                                </Button>
                            </div>
                        </div>
                    </LocalizationProvider>

                    <Collapse in={variableCollapse} unmountOnExit className="mt-4 flex-shrink-0">
                        {Object.entries(groupedVariables).map(([category, vars]) => {
                            const sitesGrouped = vars.reduce((acc, v) => {
                                const siteName =
                                    layers
                                        .find(l => l.category.id === v.categoryId)
                                        ?.sites.find(s => s.id === v.siteId)?.name || "Без сайта";
                                if (!acc[siteName]) acc[siteName] = [];
                                acc[siteName].push(v);
                                return acc;
                            }, {} as Record<string, AnalyticVariable[]>);

                            return (
                                <div key={category} style={{ marginBottom: "16px" }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        {category}
                                    </Typography>

                                    {Object.entries(sitesGrouped).map(([siteName, siteVars]) => (
                                        <div key={siteName} style={{ marginBottom: "12px", paddingLeft: "12px" }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {siteName}
                                            </Typography>
                                            <div className="w-full flex flex-wrap">
                                                {siteVars.map(v => (
                                                    <FormControlLabel
                                                        key={`${v.categoryId}-${v.siteId}-${v.id}`}
                                                        control={
                                                            <Checkbox
                                                                checked={!(disabledVariables[v.siteId]?.includes(v.id))}
                                                                onChange={() => toggleVariable(v.siteId, v.id)}
                                                            />
                                                        }
                                                        label={v.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </Collapse>

                    {!showDependencies ? (
                        <div className="mt-6 flex flex-col gap-8">
                            {viewMode === 'table' ? (
                                <Zoom in timeout={600}>
                                    <div className="mt-4 rounded-lg border border-gray-200">
                                        <TableContainer component={Paper}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ width: '64px', textAlign: 'center' }}>#</TableCell>
                                                        <TableCell sx={{ width: 192 }}>Время измерения</TableCell>
                                                        {visibleVariables.map(v => (
                                                            <TableCell key={`var-${v.categoryId}-${v.siteId}-${v.id}`}>
                                                                <Typography fontSize={14} fontWeight={500}>{v.name}</Typography>
                                                                <Typography color="textSecondary" variant="caption">
                                                                    {layers.find(s => s.category.id === v.categoryId)?.sites.find(s => s.id == v.siteId)?.name}
                                                                </Typography>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {paginatedDates.map((date, colIndex) => (
                                                        <TableRow key={`row-${date.getTime()}-${colIndex}`}>
                                                            <TableCell align="center">
                                                                <Typography color="textDisabled">{colIndex + 1 + page * rowsPerPage}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                {date.toLocaleString('ru-RU', {
                                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                                    hour: '2-digit', minute: '2-digit',
                                                                })}
                                                            </TableCell>
                                                            {visibleVariables.map((variable, rowIndex) => {
                                                                const siteKey = `${variable.categoryId}-${variable.siteId}`;
                                                                const value = valueIndex[siteKey]?.[variable.id]?.[date.getTime()] ?? null;

                                                                return (
                                                                    <TableCell key={`cell-${colIndex}-${rowIndex}-${variable.categoryId}-${variable.siteId}-${variable.id}`}>
                                                                        {value !== null ? value : '-'}
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <TablePagination
                                                component="div"
                                                count={filteredDates.length}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                rowsPerPage={rowsPerPage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                rowsPerPageOptions={[5, 10, 25, 50]}
                                                labelRowsPerPage="Строк на странице:"
                                            />
                                        </TableContainer>
                                    </div>
                                </Zoom>
                            ) : (
                                <div className="mt-4 grid grid-cols-2 gap-6">
                                    {visibleVariables.map(variable => {
                                        const siteName = layers
                                            .find(l => l.category.id === variable.categoryId)
                                            ?.sites.find(s => s.id === variable.siteId)?.name || "Без сайта";

                                        const siteKey = `${variable.categoryId}-${variable.siteId}`;
                                        const values = filteredDates.map(date => valueIndex[siteKey]?.[variable.id]?.[date.getTime()] ?? null);

                                        const singleSeries = [
                                            {
                                                label: `${variable.name} (${siteName})`,
                                                data: values
                                            }
                                        ];

                                        const stats = calcStats(values);

                                        return (
                                            <div
                                                key={`${variable.categoryId}-${variable.siteId}-${variable.id}`}
                                                className="rounded-lg border border-gray-200 p-4 flex flex-col gap-4"
                                            >
                                                <Typography variant="h6" gutterBottom>
                                                    {variable.name} — {siteName}
                                                </Typography>
                                                <LineChart
                                                    xAxis={chartXAxis}
                                                    series={singleSeries}
                                                    height={300}
                                                    className="w-full"
                                                />

                                                {stats && (
                                                    <Table size="small" className="mt-2">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>mean</TableCell>
                                                                <TableCell>std</TableCell>
                                                                <TableCell>min</TableCell>
                                                                <TableCell>25%</TableCell>
                                                                <TableCell>50%</TableCell>
                                                                <TableCell>75%</TableCell>
                                                                <TableCell>max</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>{stats.mean.toFixed(3)}</TableCell>
                                                                <TableCell>{stats.std.toFixed(3)}</TableCell>
                                                                <TableCell>{stats.min}</TableCell>
                                                                <TableCell>{stats.p25}</TableCell>
                                                                <TableCell>{stats.p50}</TableCell>
                                                                <TableCell>{stats.p75}</TableCell>
                                                                <TableCell>{stats.max}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-6 flex flex-col gap-8">
                            {viewMode === 'table' ? (
                                <Zoom in timeout={600}>
                                    <div className="mt-4 rounded-lg border border-gray-200">
                                        <TableContainer component={Paper}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ width: '64px', textAlign: 'center' }}>#</TableCell>
                                                        <TableCell >Переменная</TableCell>
                                                        <TableCell >Spearman rho</TableCell>
                                                        <TableCell>Spearman p</TableCell>
                                                        <TableCell>Pearson p</TableCell>
                                                        <TableCell>Pearson r</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dependencyRows.map(row => (
                                                        <TableRow key={row.index}>
                                                            <TableCell align="center">{row.index}</TableCell>
                                                            <TableCell >
                                                                <Typography fontWeight={500}>{row.variableName}</Typography>
                                                                <Typography variant="caption">{row.sitesPair}</Typography>
                                                            </TableCell>
                                                            <TableCell>{row.spearmanRho}</TableCell>
                                                            <TableCell>{row.spearmanP}</TableCell>
                                                            <TableCell>{row.pearsonP}</TableCell>
                                                            <TableCell>{row.pearsonR}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </Zoom>
                            ) : (
                                <div className="test">

                                </div>
                            )}
                        </div>
                    )}
                </Grid>
            </Grid>
        </View>
    );
}

export default AnalyticPage;

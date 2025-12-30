import {
    Button,
    Checkbox,
    Collapse,
    FormControlLabel,
    Stack,
    Typography,
    Zoom,
    TablePagination,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { LineChart } from "@mui/x-charts/LineChart";
import TuneIcon from "@mui/icons-material/Tune";

import { useDisabledVariables } from "../../model/useDisabledVariables";
import { useInfoStore } from "../../model/useInfoStore";
import { ApiResponse, GroupedData } from "@/types";
import Variable from "@/entites/variable/types/variable";
import { api } from "@/shared/model/api/instance";
import { useAuth } from "@/shared/model/auth";

function LayerChart() {
    const { token } = useAuth();

    const { site, category } = useInfoStore();
    const { disabledVariables, toggleVariable } = useDisabledVariables();

    const [variableCollapse, setVariableCollapse] = useState(false);
    const [infoVariables, setInfoVariables] = useState<Variable[]>([]);
    const [infoData, setInfoData] = useState<GroupedData[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [minDate, setMinDate] = useState<Date | null>(null);
    const [maxDate, setMaxDate] = useState<Date | null>(null);

    useEffect(() => {
        if (!category?.id || !token) return;
        api.get<ApiResponse<Variable[]>>(`/data/category/${category.id}/variables`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(({ data }) => setInfoVariables(data.data))
            .catch(console.error);
    }, [category, token]);

    const fetchData = useCallback(async () => {
        if (!category?.id || !site?.code || !token) return;

        try {
            const res = await api.get<ApiResponse<{
                start: Date;
                end: Date;
                minDate: Date;
                maxDate: Date;
                total: number;
                content: GroupedData[]
            }>>(
                `/data/category/${category.id}/by-site/${site.code}/by-date`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        start: startDate?.toISOString(),
                        end: endDate?.toISOString(),
                        page,
                        size: rowsPerPage,
                    },
                }
            );

            const { content, total, start, end, maxDate, minDate } = res.data.data;
            setInfoData(content);
            setTotalRows(total);

            setMinDate(new Date(minDate));
            setMaxDate(new Date(maxDate));

            if (!startDate) setStartDate(new Date(start));
            if (!endDate) setEndDate(new Date(end));
        } catch (e) {
            console.error(e);
        }
    }, [category, site, token, page, rowsPerPage, startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = useMemo(() => {
        if (!startDate && !endDate) return infoData;
        return infoData.filter(group => {
            const groupDate = new Date(group.group.date_utc).getTime();
            const from = startDate?.getTime() ?? -Infinity;
            const to = endDate?.getTime() ?? Infinity;
            return groupDate >= from && groupDate <= to;
        });
    }, [infoData, startDate, endDate]);

    const chartData = useMemo(() => {
        if (!infoVariables.length || !filteredData.length) {
            return { xAxis: [], series: [] };
        }

        const activeVariables = infoVariables.filter(
            v => !disabledVariables.includes(v.id)
        );

        const xAxis = filteredData.map(group =>
            new Date(group.group.date_utc).toLocaleString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        );

        const series = activeVariables.map(variable => ({
            label: variable.name,
            data: filteredData.map(group => {
                const val = group.values.find(v => v.variable.id === variable.id);
                const num = val?.value;
                if (num === null || num === undefined) return null;
                const n = Number(num);
                return isNaN(n) ? null : n;
            }),
        }));

        return { xAxis, series };
    }, [infoVariables, filteredData, disabledVariables]);

    return (
        <Zoom in={true} timeout={600}>
            <div>
                <div className="flex justify-between gap-3 items-center">
                    <Button
                        variant="outlined"
                        startIcon={<TuneIcon />}
                        onClick={() => setVariableCollapse(!variableCollapse)}
                        className="h-fit"
                    >
                        Переменные
                    </Button>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack direction="row" spacing={2} mt={2} className="mb-4">
                            <DateTimePicker
                                label="От"
                                value={startDate}
                                onChange={(newValue: Date | null) => setStartDate(newValue)}
                                minDateTime={minDate ?? undefined}
                                maxDateTime={maxDate ?? undefined}
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                            />
                            <DateTimePicker
                                label="До"
                                value={endDate}
                                onChange={(newValue: Date | null) => setEndDate(newValue)}
                                minDateTime={minDate ?? undefined}
                                maxDateTime={maxDate ?? undefined}
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                            />
                        </Stack>
                    </LocalizationProvider>
                </div>

                <Collapse in={variableCollapse}>
                    <div style={{ padding: "8px 16px" }}>
                        {infoVariables.map(v => (
                            <FormControlLabel
                                key={v.id}
                                control={
                                    <Checkbox
                                        checked={!disabledVariables.includes(v.id)}
                                        onChange={() => toggleVariable(v.id)}
                                    />
                                }
                                label={v.name}
                            />
                        ))}
                    </div>
                </Collapse>

                <div className="mt-1 grid grid-cols-1 gap-3">
                    {chartData.series.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            Недостаточно данных для отображения графиков.
                        </Typography>
                    ) : (
                        chartData.series.map(seriesItem => (
                            <div
                                key={seriesItem.label}
                                className="rounded-lg border border-gray-200 p-4 bg-white"
                            >
                                <Typography variant="h6" gutterBottom>
                                    {seriesItem.label}
                                </Typography>
                                <LineChart
                                    xAxis={[{ scaleType: "point", data: chartData.xAxis }]}
                                    series={[seriesItem]}
                                    height={256}
                                />
                            </div>
                        ))
                    )}
                </div>

                <TablePagination
                    component="div"
                    count={totalRows}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </Zoom>
    );
}

export default LayerChart;

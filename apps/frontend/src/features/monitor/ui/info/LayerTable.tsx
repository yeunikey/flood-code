import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Zoom,
    TablePagination,
    Button,
    Collapse,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useState, useEffect } from "react";
import TuneIcon from '@mui/icons-material/Tune';
import { useDisabledVariables } from "../../model/useDisabledVariables";
import { useAuth } from "@/shared/model/auth";
import { api } from "@/shared/model/api/instance";
import { ApiResponse } from "@/types";
import { useInfoStore } from "../../model/useInfoStore";

interface Variable {
    id: number;
    name: string;
}

interface DataValue {
    id: number;
    value: string;
    variable: Variable;
}

interface GroupedData {
    group: {
        id: number;
        date_utc: string;
        category: { id: number; name: string };
        site: { id: number; code: string; name: string };
    };
    values: DataValue[];
}

interface PaginatedResult<T> {
    content: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


export default function LayerTablePaginated() {
    const { disabledVariables, toggleVariable } = useDisabledVariables();
    const { token } = useAuth();

    const { site, category } = useInfoStore();

    const [variableCollapse, setVariableCollapse] = useState(false);
    const [infoVariables, setInfoVariables] = useState<Variable[]>([]);
    const [infoData, setInfoData] = useState<GroupedData[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        api.get<ApiResponse<Variable[]>>(`/data/category/${category?.id}/variables`, { headers: { Authorization: `Bearer ${token}` } })
            .then(({ data }) => setInfoVariables(data.data));
    }, [category, site, token]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await api.get<ApiResponse<PaginatedResult<GroupedData>>>(`/data/category/${category?.id}/by-site/${site?.code}/paginated`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: page + 1, limit: rowsPerPage },
            });
            setInfoData(res.data.data.content);
            setTotalRows(res.data.data.total);
        };
        fetchData();
    }, [category, site, page, rowsPerPage, token]);

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Zoom in={true} timeout={600}>
            <div className="test">
                <Button variant="outlined" startIcon={<TuneIcon />} onClick={() => setVariableCollapse(!variableCollapse)}>
                    Переменные
                </Button>

                <Collapse in={variableCollapse}>
                    <div style={{ padding: "8px 16px" }}>
                        {infoVariables.map(v => (
                            <FormControlLabel
                                key={v.id}
                                control={<Checkbox checked={!disabledVariables.includes(v.id)} onChange={() => toggleVariable(v.id)} />}
                                label={v.name}
                            />
                        ))}
                    </div>
                </Collapse>

                <div className="mt-4 rounded-lg border border-gray-200">
                    <Paper sx={{ width: '100%', overflow: 'scroll' }}>
                        <TableContainer>
                            <Table size="small" aria-label="variables table" sx={{ overflowX: 'scroll' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">#</TableCell>
                                        <TableCell>Время измерения</TableCell>
                                        {infoVariables.filter(v => !disabledVariables.includes(v.id))
                                            .map(v => <TableCell key={v.id}>{v.name}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {infoData.map((group, i) => (
                                        <TableRow key={group.group.id}>
                                            <TableCell align="center">{page * rowsPerPage + i + 1}</TableCell>
                                            <TableCell>{new Date(group.group.date_utc).toLocaleString('ru-RU', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}</TableCell>
                                            {infoVariables.filter(v => !disabledVariables.includes(v.id))
                                                .map(variable => {
                                                    const value = group.values.find(e => e.variable.id === variable.id);
                                                    return <TableCell key={variable.id}>{value?.value ?? '-'}</TableCell>;
                                                })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <TablePagination
                                component="div"
                                count={totalRows}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                labelRowsPerPage="Строк на странице:"
                            />
                        </TableContainer>
                    </Paper>
                </div>
            </div>
        </Zoom>
    );
}

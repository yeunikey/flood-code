import {
    Collapse,
    Typography,
    Divider,
} from "@mui/material";
import { useLayersStore } from "../model/useLayersStore";

const levelsHydro = [
    { label: "Экстремальный уровень", color: "#c62828", count: 2 },
    { label: "Опасный уровень", color: "#ef5350", count: 3 },
    { label: "Угрожающий уровень", color: "#ffa726", count: 4 },
    { label: "Уровень неизвестен", color: "#bdbdbd", count: 55 },
    { label: "Обычный уровень", color: "#66bb6a", count: 43 },
];

const levelsMeteo = [
    { label: "Экстремальный уровень", color: "#c62828", shape: "▲", count: 4 },
    { label: "Опасный уровень", color: "#ef6c00", shape: "▲", count: 3 },
    { label: "Угрожающий уровень", color: "#ffb300", shape: "▲", count: 6 },
    { label: "Уровень неизвестен", color: "#9e9e9e", shape: "▲", count: 3 },
    { label: "Обычный уровень", color: "#43a047", shape: "▲", count: 3 },
];

function InfoCollapse() {
    const { infoCollapse } = useLayersStore();

    return (
        <Collapse
            in={infoCollapse}
            orientation="horizontal"
            timeout={300}
            unmountOnExit
        >
            <div className="w-80 py-6 px-6 relative bg-white">

                <Typography fontWeight={500} fontSize={18}>
                    Количество гидропостов по уровням опасности:
                </Typography>

                <div className="mt-3">
                    {levelsHydro.map((item, i) => (
                        <div key={i} className="flex items-center gap-6">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />

                            <Typography color="textSecondary">{item.label}</Typography>
                        </div>
                    ))}
                </div>

                <Typography fontWeight={500} fontSize={18} className="pt-6">
                    Количество метеостанций по уровням опасности:
                </Typography>

                <div className="mt-3">
                    {levelsMeteo.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6">
                            <span
                                className="w-0 h-0 border-l-8 border-r-8 border-b-14"
                                style={{
                                    borderColor: `transparent transparent ${item.color} transparent`,
                                }}
                            />
                            <Typography color="textSecondary">{item.label}</Typography>
                        </div>
                    ))}
                </div>

                <Divider orientation="vertical" />
            </div>

        </Collapse>
    );
}

export default InfoCollapse;

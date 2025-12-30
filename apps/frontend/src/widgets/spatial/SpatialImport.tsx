import React, { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Typography, Select, MenuItem, TextField, Button, Divider, RadioGroup, FormControlLabel, Radio, Box } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { vapi } from '@/shared/model/api/instance';
import { toast } from 'react-toastify';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const SpatialImport: React.FC = () => {
    const [selectedBasin, setSelectedBasin] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [geojsonFile, setGeojsonFile] = useState<File | null>(null);
    const [mbtilesFile, setMbtilesFile] = useState<File | null>(null);

    const [colorMode, setColorMode] = useState<'solid' | 'gradient'>("solid");
    const [selectedVariable, setSelectedVariable] = useState<string>("");
    const [solidColor, setSolidColor] = useState<string>("#1976D2");
    const [gradientColorA, setGradientColorA] = useState<string>("#FFFF00");
    const [gradientColorB, setGradientColorB] = useState<string>("#FF0000");

    const [geoProperties, setGeoProperties] = useState<{ id: string, name: string }[]>([]);

    const basins = [
        { id: 1, name: "Бассейн А" },
        { id: 2, name: "Бассейн B" },
        { id: 3, name: "Бассейн C" },
    ];

    const handleGeojsonChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e, setGeojsonFile);

        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = JSON.parse(event.target?.result as string);
                    if (json.features && Array.isArray(json.features) && json.features.length > 0) {
                        const firstFeatureProps = json.features[0].properties || {};
                        const propsArray = Object.keys(firstFeatureProps).map(key => ({
                            id: key,
                            name: key
                        }));
                        setGeoProperties(propsArray);
                    }
                } catch (err) {
                    console.error("Ошибка чтения GeoJSON", err);
                }
            };
            reader.readAsText(file);
        } else {
            setGeoProperties([]);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>, setFile: Dispatch<SetStateAction<File | null>>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        } else {
            setFile(null);
        }
    };

    const handleColorChange = (e: ChangeEvent<HTMLInputElement>, setColor: Dispatch<SetStateAction<string>>) => {
        setColor(e.target.value);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        if (geojsonFile) formData.append("geo", geojsonFile);
        if (mbtilesFile) formData.append("mbtiles", mbtilesFile);

        formData.append("name", name);
        formData.append("type", "geojson");
        formData.append("colorMode", colorMode);
        formData.append("solidColor", solidColor);
        formData.append("gradientColorA", gradientColorA);
        formData.append("gradientColorB", gradientColorB);
        formData.append("selectedVariable", selectedVariable);

        console.log({
            name,
            type: "geojson",
            colorMode,
            solidColor,
            gradientColorA,
            gradientColorB,
            selectedVariable,
            geojsonFile,
            mbtilesFile,
        })

        await vapi.post("/tiles/upload", formData);

        toast.success("Файлы успешно загружены!");
    };

    return (
        <div className="py-12 px-6 space-y-6 max-w-lg mx-auto">

            <Box className="space-y-4">
                <div className='flex flex-col gap-1'>
                    <Typography variant="subtitle2" component="label" className="block text-gray-700 font-medium">
                        Стандарт данных:
                    </Typography>
                    <Select
                        size="small"
                        fullWidth
                        value="GeoJSON"
                    >
                        <MenuItem value="GeoJSON">GeoJSON</MenuItem>
                    </Select>
                </div>

                <div className='flex flex-col gap-1'>
                    <Typography variant="subtitle2" component="label" className="block text-gray-700 font-medium">
                        Выбор бассейна:
                    </Typography>
                    <Select
                        size="small"
                        fullWidth
                        value={selectedBasin}
                        onChange={(e) => setSelectedBasin(e.target.value as string)}
                        displayEmpty
                        disabled
                    >
                        <MenuItem value="" disabled>Выберите бассейн (недоступно)</MenuItem>
                        {basins.map(basin => (
                            <MenuItem key={basin.id} value={basin.id}>
                                {basin.name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </Box>

            <div className="py-2">
                <Divider orientation='horizontal' />
            </div>

            <Box className="flex flex-col gap-2">
                <Typography variant="subtitle2" className="text-gray-700 font-bold">
                    Загрузка файлов:
                </Typography>

                <div className="flex items-center gap-4">
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        className="bg-green-600 hover:bg-green-700"
                        disableElevation
                    >
                        Выбрать GeoJSON
                        <VisuallyHiddenInput type="file" accept=".geojson" onChange={handleGeojsonChange} />
                    </Button>
                    <Typography variant="body2" className="truncate w-1/2 text-gray-500">
                        {geojsonFile ? geojsonFile.name : "Файл не выбран"}
                    </Typography>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        disableElevation
                    >
                        Выбрать MBTiles
                        <VisuallyHiddenInput type="file" accept=".mbtiles" onChange={(e) => handleFileChange(e, setMbtilesFile)} />
                    </Button>
                    <Typography variant="body2" className="truncate w-1/2 text-gray-500">
                        {mbtilesFile ? mbtilesFile.name : "Файл не выбран"}
                    </Typography>
                </div>
            </Box>

            <div className="py-2">
                <Divider orientation='horizontal' />
            </div>

            <Box className="space-y-4">
                <Typography variant="subtitle2" className="text-gray-700 font-bold">
                    Визуализация цвета:
                </Typography>

                <RadioGroup
                    row
                    value={colorMode}
                    onChange={(e) => setColorMode(e.target.value as 'solid' | 'gradient')}
                    name="color-mode-group"
                    className="justify-around"
                >
                    <FormControlLabel value="solid" control={<Radio size="small" />} label="Сплошной цвет" />
                    <FormControlLabel value="gradient" control={<Radio size="small" />} label="Градация цветов" />
                </RadioGroup>

                {colorMode === 'solid' ? (
                    <Box className="flex items-center gap-3">
                        <Typography variant="body2" className="text-gray-600 shrink-0">Цвет:</Typography>
                        <TextField
                            type="color"
                            size="small"
                            variant="standard"
                            value={solidColor}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleColorChange(e, setSolidColor)}
                            className="p-0 border rounded-lg w-16 overflow-hidden"
                            InputProps={{
                                disableUnderline: true, sx: {
                                    width: 64,
                                    height: 32,              // ✅ регулирует сам input
                                    p: 0,
                                    '& input': {
                                        padding: 0,
                                        height: 32,
                                        width: 64,
                                        cursor: 'pointer',
                                    },
                                },
                            }}
                        />
                        <TextField
                            size="small"
                            value={solidColor}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleColorChange(e, setSolidColor)}
                            className="flex-grow"
                        />
                    </Box>
                ) : (
                    <Box className="space-y-3">
                        <div className='flex flex-col gap-1'>
                            <Typography variant="body2" component="label" className="block text-gray-600">
                                Переменная GeoJSON (properties):
                            </Typography>
                            <Select
                                size="small"
                                fullWidth
                                value={selectedVariable}
                                onChange={(e) => setSelectedVariable(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Выберите переменную</MenuItem>
                                {geoProperties.map(prop => (
                                    <MenuItem key={prop.id} value={prop.id}>
                                        {prop.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <Box className="flex gap-4">
                            <Box className="flex items-center gap-2 w-1/2">
                                <TextField
                                    type="color"
                                    size="small"
                                    variant="standard"
                                    value={gradientColorA}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleColorChange(e, setGradientColorA)}
                                    className="p-0 border rounded-lg h-10 w-16 overflow-hidden"
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: {
                                            width: 64,
                                            height: 32,              // ✅ регулирует сам input
                                            p: 0,
                                            '& input': {
                                                padding: 0,
                                                height: 32,
                                                width: 64,
                                                cursor: 'pointer',
                                            },
                                        },
                                    }}
                                />
                                <TextField
                                    size="small"
                                    value={gradientColorA}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleColorChange(e, setGradientColorA)}
                                    className="flex-grow"
                                />
                            </Box>

                            <Box className="flex items-center gap-2 w-1/2">
                                <TextField
                                    type="color"
                                    size="small"
                                    variant="standard"
                                    value={gradientColorB}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleColorChange(e, setGradientColorB)}
                                    className="p-0 border rounded-lg h-10 w-16 overflow-hidden"
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: {
                                            width: 64,
                                            height: 32,              // ✅ регулирует сам input
                                            p: 0,
                                            '& input': {
                                                padding: 0,
                                                height: 32,
                                                width: 64,
                                                cursor: 'pointer',
                                            },
                                        },
                                    }}
                                />
                                <TextField
                                    size="small"
                                    value={gradientColorB}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleColorChange(e, setGradientColorB)}
                                    className="flex-grow"
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>

            <div className="py-2">
                <Divider orientation='horizontal' />
            </div>

            <div className='flex flex-col gap-1'>
                <Typography variant="subtitle2" component="label" htmlFor="name-input" className="block text-gray-700 font-bold">
                    Название файла:
                </Typography>
                <TextField
                    id="name-input"
                    label="Введите название"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <Button variant="contained" color="primary" fullWidth className="mt-6" onClick={handleSubmit} disableElevation>
                Импортировать данные
            </Button>
        </div>
    );
}

export default SpatialImport;

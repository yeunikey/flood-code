import { useSpatialStore } from "@/features/spatial/model/useSpatialStore";
import { api } from "@/shared/model/api/instance";
import { ApiResponse, Tile } from "@/types";
import { Grid, List, CardActionArea, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect } from "react";

function SpatialItems() {

    const {
        tiles, setTiles,
        selectedTile, setSelectedTile,
    } = useSpatialStore();

    const fetchTiles = async () => {
        await api.get<ApiResponse<Tile[]>>('/tiles').then(({ data }) => {
            setTiles(data.data);
        });
    }

    useEffect(() => {
        fetchTiles();
    }, []);

    return (
        <Grid size={2} className="h-[calc(100dvh-178px)] overflow-y-scroll py-3 flex flex-col">
            <List dense>
                {tiles.map((tile) => (
                    <CardActionArea key={tile.id} onClick={() => setSelectedTile(tile)} sx={{ backgroundColor: selectedTile?.id === tile.id ? "rgba(0, 0, 0, 0.08)" : "transparent" }}>
                        <ListItem
                        >
                            <ListItemText
                                primary={<Typography fontSize="16px" fontWeight={500} className="w-full">{tile.name}</Typography>}
                                secondary={"geojson"}
                            />
                        </ListItem>
                    </CardActionArea>
                ))}
            </List>
        </Grid>
    );
}

export default SpatialItems;
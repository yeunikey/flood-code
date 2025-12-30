import SpatialMap from "@/features/spatial/ui/SpatialMap";
import { Grid, Divider, Button } from "@mui/material";
import SpatialItems from "../../features/spatial/ui/SpatialItems";

function SpatialView() {

    return (
        <Grid container>
            <SpatialItems />
            <Divider orientation="vertical" />

            <Grid size={"grow"} className="grow flex flex-col flex-1">

                {/* <div className="px-3 py-4 flex items-center space-between gap-3 w-full">
                        <div className="flex-1 flex gap-12 items-center">
                            <div>
                                Период:
                            </div>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack direction="row" spacing={2}>
                                    <DateTimePicker
                                        label="От"
                                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    />
                                    <DateTimePicker
                                        label="До"
                                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    />
                                </Stack>
                            </LocalizationProvider>
                        </div>

                        <Button variant="contained" disableElevation>
                            Обновить
                        </Button>
                    </div> */}

                <Divider orientation="horizontal" />

                <div className="grow flex flex-1 min-w-0">
                    <SpatialMap />
                </div>


                <Divider orientation="horizontal" />

                <div className="px-3 py-4 flex items-center space-between gap-3 w-full">
                    <Button variant="contained" disableElevation>
                        Скачать выбранный слой
                    </Button>
                </div>

            </Grid>
        </Grid >
    );
}

export default SpatialView;
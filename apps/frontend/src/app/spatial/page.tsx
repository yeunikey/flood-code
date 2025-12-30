"use client";;
import View from "@/shared/ui/View";
import SpatialImport from "@/widgets/spatial/SpatialImport";
import SpatialView from "@/widgets/spatial/SpatialView";
import { Divider, Tab, Tabs } from "@mui/material";
import { useState } from "react";

function SpatialPage() {

    const [currentPage, setPage] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setPage(newValue);
    };

    return (
        <View links={["Паводки", "Работа с пространственными данными"]} className="relative h-[calc(100dvh-244px)] w-full">

            <div className="py-2 pb-0 px-3">
                <Tabs value={currentPage} onChange={handleChange}>
                    <Tab label="Экспорт из базы" />
                    <Tab label="Экспорт из внешних источников" />
                    <Tab label="Импорт" />
                </Tabs>
            </div>

            <Divider orientation="horizontal" />

            {currentPage == 0 && (
                <SpatialView />
            )}

            {currentPage == 2 && (
                <SpatialImport />
            )}

        </View >
    );
}

export default SpatialPage;
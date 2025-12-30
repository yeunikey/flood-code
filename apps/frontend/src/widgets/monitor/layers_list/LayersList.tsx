'use client'

import LayerSearch from "@/features/monitor/ui/LayerTools";
import LayerItems from "@/features/monitor/ui/LayerItems";

function LayersList() {
    return (
        <div className="overflow-y-scroll py-6 flex flex-col gap-3">
            <LayerSearch />
            <LayerItems />
        </div>
    );
}

export default LayersList;

'use client'

import View from "@/shared/ui/View";
import { Divider } from "@mui/material";
import CategoryList from "@/widgets/import/categories_list/CategoryList";
import { useImportStore } from "@/features/import/model/useImportStore";
import CreateVariableModal from "@/features/import/ui/modal/CreateVariableModal";
import ProgressModal from "@/features/import/ui/modal/ProgressModal";
import { stepperPages } from "@/features/import/model/pages";


export default function ImportPage() {

    const { stepperLevel } = useImportStore();

    return (
        <View links={['Паводки', 'Импорт данных']} className="flex h-[calc(100dvh-8rem)]">

            <CreateVariableModal />
            <ProgressModal />

            <div className="py-6 w-96">
                <CategoryList />
            </div>

            <Divider orientation="vertical" />

            <div className="overflow-y-scroll w-full">
                {stepperPages[stepperLevel]}
            </div>

        </View>
    )
}
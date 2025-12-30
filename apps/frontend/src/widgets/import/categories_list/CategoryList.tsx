import { Card, CardActionArea, CardContent, Zoom } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useCategories } from "@/entites/category/model/useCategories";
import CategoryItem from "@/features/import/ui/CategoryItem";
import { useEffect } from "react";
import { useCategorySelection } from "@/features/import/model/useCategorySelection";
import CreateCategoryModal from "@/features/import/ui/modal/CreateCategoryModal";
import { TransitionGroup } from 'react-transition-group';
import { useCategoryModal } from "@/features/import/model/modal/useCategoryModal";
import { fetchCategories } from "@/features/import/model/services/categoryService";

function CategoriesList() {

    const { categories } = useCategories();
    const { setSelectedCategory } = useCategorySelection();

    const { setOpen } = useCategoryModal();

    useEffect(() => {
        fetchCategories();
    }, [])

    useEffect(() => {

        if (categories.length == 0) {
            return;
        }

        setSelectedCategory(categories[0])

    }, [categories])

    return (
        <>
            <CreateCategoryModal />

            <TransitionGroup className={"space-y-1"}>

                {categories.map((category, i) => (
                    <CategoryItem category={category} i={i} key={i} />
                ))}

                <Zoom in={true} style={{ transitionDelay: `500ms` }}>
                    <Card elevation={0} className="flex justify-center">
                        <CardActionArea onClick={() => setOpen(true)}>
                            <CardContent style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyItems: 'center' }}>
                                <AddIcon fontSize="small" /> Создать
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Zoom>

            </TransitionGroup>
        </>
    );
}

export default CategoriesList;
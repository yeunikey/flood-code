import { Category } from "@/entites/category/types/categories";
import { ListItemButton, ListItemText, Typography, Zoom } from "@mui/material";
import { useCategorySelection } from "../model/useCategorySelection";

interface CategoryProps {
    category: Category,
    i: number
}

function CategoryItem({ category, i }: CategoryProps) {

    const { selectedCategory, setSelectedCategory } = useCategorySelection();

    return (
        <Zoom in={true} timeout={500} style={{ transitionDelay: `${(i + 1) * 100}ms` }}>
            <ListItemButton onClick={() => setSelectedCategory(category)} sx={{
                backgroundColor: selectedCategory?.id == category.id ? '#f3f4f6' : ''
            }}>
                <ListItemText
                    primary={
                        <Typography fontWeight={500}>{category.name}</Typography>
                    }
                    secondary={
                        <Typography fontSize={14} color="textSecondary" className="line-clamp-2">
                            {category.description}
                        </Typography>
                    }
                />
            </ListItemButton>
        </Zoom>
    );
}

export default CategoryItem;
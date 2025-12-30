import { Category } from "@/entites/category/types/categories";
import Site from "@/entites/site/types/site";

interface Layer {
    category: Category,
    sites: Site[]
}

export default Layer;
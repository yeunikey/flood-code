import { Unit } from "@/types";

interface Variable {
    id: number;
    name: string;
    unit: Unit;
    description: string;
}

export default Variable;
import { CoreOutput } from "src/common/dtos/core.output";
import { Category } from "../entities/category.entity";

export class CategoryListOutput extends CoreOutput {
    categories?: Category[];
}
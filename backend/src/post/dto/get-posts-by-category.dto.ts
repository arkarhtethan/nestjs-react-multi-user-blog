import { CoreOutput } from "../../common/dtos/core.output";
import { PaginationInput, PaginationOutput } from "../../common/dtos/pagination.output";
import { Category } from "../entities/category.entity";
import { Post } from "../entities/post.entity";

class PostsByCategoryOutput extends PaginationOutput {
    posts: Post[];
    category: Category;
}

export class GetAllPostsByCategoryDto extends PaginationInput { }

export class GetAllPostsByCategoryOutput extends CoreOutput {
    data?: PostsByCategoryOutput;
}
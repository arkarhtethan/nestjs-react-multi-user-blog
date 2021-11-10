import { CoreOutput } from "src/common/dtos/core.output";
import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.output";
import { Post } from "../entities/post.entity";

class PostsByCategoryOutput extends PaginationOutput {
    posts: Post[];
}

export class GetAllPostsByCategoryDto extends PaginationInput { }

export class GetAllPostsByCategoryOutput extends CoreOutput {
    data?: PostsByCategoryOutput;
}
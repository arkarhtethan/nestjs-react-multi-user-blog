import { CoreOutput } from "src/common/dtos/core.output";
import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.output";
import { Post } from "../entities/post.entity";

class PostsByUserOutput extends PaginationOutput {
    posts: Post[];
}

export class GetAllPostsByUserDto extends PaginationInput { }

export class GetAllPostsByUserOutput extends CoreOutput {
    data?: PostsByUserOutput;
}
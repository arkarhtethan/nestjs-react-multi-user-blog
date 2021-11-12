import { CoreOutput } from "../../common/dtos/core.output";
import { PaginationInput, PaginationOutput } from "../../common/dtos/pagination.output";
import { Post } from "../entities/post.entity";

class PostsOutput extends PaginationOutput {
    posts: Post[];
}

export class GetAllPostsDto extends PaginationInput { }

export class GetAllPostsOutput extends CoreOutput {
    data?: PostsOutput;
}
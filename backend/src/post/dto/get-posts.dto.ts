import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.output";
import { Post } from "../entities/post.entity";

class PostsOutput {
    posts: Post[];
}

export class GetAllPostsDto extends PaginationInput { }

export class GetAllPostsOutput extends PaginationOutput {
    data?: PostsOutput;
}
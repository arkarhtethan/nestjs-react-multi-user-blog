import { CoreOutput } from "src/common/dtos/core.output";
import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.output";
import { Post } from "../entities/post.entity";

class MyPostsOutput extends PaginationOutput {
    posts: Post[];
}

export class GetAllMyPostsDto extends PaginationInput { }

export class GetAllMyPostsOutput extends CoreOutput {
    data?: MyPostsOutput;
}
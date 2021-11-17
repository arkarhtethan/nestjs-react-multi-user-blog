import { User } from "src/user/entities/user.entity";
import { CoreOutput } from "../../common/dtos/core.output";
import { PaginationInput, PaginationOutput } from "../../common/dtos/pagination.output";
import { Post } from "../entities/post.entity";

class PostsByUserOutput extends PaginationOutput {
    posts: Post[];
    user: User;
}

export class GetAllPostsByUserDto extends PaginationInput { }

export class GetAllPostsByUserOutput extends CoreOutput {
    data?: PostsByUserOutput;
}
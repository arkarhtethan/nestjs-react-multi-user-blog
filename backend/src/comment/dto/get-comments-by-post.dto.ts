import { CoreOutput } from "src/common/dtos/core.output";
import { Comment } from "../entities/comment.entity";
import { PaginationInput } from "src/common/dtos/pagination.output";

export class GetCommentsByPostIdDto extends PaginationInput { }
export class GetCommentsByPostIdOutput extends CoreOutput {
    comments?: Comment[];
}

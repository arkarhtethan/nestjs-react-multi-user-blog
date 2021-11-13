import { CoreOutput } from "src/common/dtos/core.output";
import { Comment } from "../entities/comment.entity";

export class GetCommentsByPostIdOutput extends CoreOutput {
    comments?: Comment[];
}
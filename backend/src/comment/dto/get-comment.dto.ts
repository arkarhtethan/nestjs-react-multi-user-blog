import { CoreOutput } from "src/common/dtos/core.output";
import { Comment } from "../entities/comment.entity";

export class GetCommentOutput extends CoreOutput {
    comment?: Comment;
}
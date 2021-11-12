import { CoreOutput } from "../../common/dtos/core.output";
import { Post } from "../entities/post.entity";

export class GetPostOutput extends CoreOutput {
    post?: Post;
}
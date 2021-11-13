import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Comment } from "../entities/comment.entity";

export class CreateCommentDto extends PickType(Comment, [
    'text',
]) {

    @IsNumber()
    @IsNotEmpty()
    postId: number;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    parentId?: number;

}

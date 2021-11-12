import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";
import { CoreOutput } from "../../common/dtos/core.output";
import { Post } from "../entities/post.entity";

export class CreatePostDto extends PickType(Post,
    [
        'title',
        'content',
        'image',
        'published',
        'summary',
    ]
) {
    @IsString()
    @IsNotEmpty()
    category: string;
}

export class CreatePostOutput extends CoreOutput { }
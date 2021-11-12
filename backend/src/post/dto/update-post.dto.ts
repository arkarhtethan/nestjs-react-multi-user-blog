import { PartialType } from '@nestjs/mapped-types';
import { CoreOutput } from '../../common/dtos/core.output';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) { }

export class UpdatePostOutput extends CoreOutput { }
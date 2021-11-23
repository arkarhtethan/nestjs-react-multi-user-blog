import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { User } from 'src/user/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentOutput } from './dto/get-comment.dto';
import { GetCommentsByPostIdDto } from './dto/get-comments-by-post.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @Role(['User', 'Admin'])
  create (@Body() createCommentDto: CreateCommentDto, @AuthUser() user: User): Promise<CoreOutput> {
    return this.commentService.create(createCommentDto, user);
  }

  @Get('post/:id')
  commentByPostId (@Param('id') id: string, @Query() getCommentsByPostIdDto: GetCommentsByPostIdDto) {
    return this.commentService.commentByPostId(+id, getCommentsByPostIdDto);
  }

  @Get(':id')
  findOne (@Param('id') id: string): Promise<GetCommentOutput> {
    return this.commentService.findOne(+id);
  }

  @Role(['User', 'Admin'])
  @Patch(':id')
  update (
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @AuthUser() user: User,
  ) {
    return this.commentService.update(+id, updateCommentDto, user);
  }

  @Role(['User', 'Admin'])
  @Delete(':id')
  remove (
    @Param('id') id: string,
    @AuthUser() user: User,
  ) {
    return this.commentService.remove(+id, user);
  }
}

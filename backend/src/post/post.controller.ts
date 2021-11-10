import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, CreatePostOutput } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/auth/role.decorator';
import { GetAllPostsDto } from './dto/get-posts.dto';
import { GetPostOutput } from './dto/get-post.dto';
import { GetAllPostsByCategoryDto } from './dto/get-posts-by-category.dto';
import { GetAllPostsByUserDto } from './dto/get-posts-by-user.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @Role(['User'])
  create (
    @Body() createPostDto: CreatePostDto,
    @AuthUser() user: User,
  ): Promise<CreatePostOutput> {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll (@Query() getAllPostsDto: GetAllPostsDto) {
    return this.postService.findAll(getAllPostsDto);
  }

  @Post('publish/:id')
  publish (@Param('id') id: string) {

  }

  @Get('/category/:slug')
  postByCategory (
    @Param('slug') slug: string,
    @Query() getAllPostsByCategoryDto: GetAllPostsByCategoryDto
  ) {
    return this.postService.postsByCategory(slug, getAllPostsByCategoryDto)
  }

  @Get('/user/:username')
  postByUser (
    @Param('username') username: string,
    @Query() getAllPostsByUserDto: GetAllPostsByUserDto) {
    return this.postService.postByUser(username, getAllPostsByUserDto)
  }

  @Get(':id')
  findOne (@Param('id') id: string): Promise<GetPostOutput> {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update (@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}

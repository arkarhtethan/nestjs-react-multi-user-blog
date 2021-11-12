import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, CreatePostOutput } from './dto/create-post.dto';
import { UpdatePostDto, UpdatePostOutput } from './dto/update-post.dto';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { Role } from '../auth/role.decorator';
import { GetAllPostsDto } from './dto/get-posts.dto';
import { GetPostOutput } from './dto/get-post.dto';
import { GetAllPostsByCategoryDto } from './dto/get-posts-by-category.dto';
import { GetAllPostsByUserDto } from './dto/get-posts-by-user.dto';
import { GetAllMyPostsDto } from './dto/my-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { CategoryListOutput } from './dto/category-list.dto';

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

  @Role(['User',])
  @Get('mypost')
  myPost (
    @AuthUser() user: User,
    @Query() getAllMyPostsDto: GetAllMyPostsDto,
  ) {
    return this.postService.myPost(user, getAllMyPostsDto)
  }

  @Patch('publish/:id')
  @Role(['User'])
  publish (
    @Param('id') id: string,
    @AuthUser() user: User
  ) {
    return this.postService.publish(+id, user)
  }

  @Get('/category/list')
  categoryList (): Promise<CategoryListOutput> {
    return this.postService.categoryList();
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
  @Role(['User'])
  update (
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<UpdatePostOutput> {
    return this.postService.update(+id, updatePostDto, user);
  }

  @Delete(':id')
  @Role(['User', 'Admin'])
  remove (
    @AuthUser() user: User,
    @Param('id') id: string
  ): Promise<DeletePostDto> {
    return this.postService.remove(+id, user);
  }
}

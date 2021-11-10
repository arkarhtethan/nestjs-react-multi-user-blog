import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, CreatePostOutput } from './dto/create-post.dto';
import { GetAllPostsDto, GetAllPostsOutput } from './dto/get-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Category } from './entities/category.entity';
import { Post } from './entities/post.entity';
import { DEFAULT_POSTS_PER_PAGE, DEFAULT_PAGE_NUMBER } from '../common/constants'

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  private async getOrCreateCategory (name: string) {
    let category = await this.categoryRepository.findOne({ name })
    if (!category) {
      category = await this.categoryRepository.create({ name })
      await this.categoryRepository.save(category)
    }
    return category;
  }

  async create (
    { title,
      summary,
      content,
      category: categoryName,
      image,
      published
    }: CreatePostDto,
    user: User
  ): Promise<CreatePostOutput> {
    try {
      const category = await this.getOrCreateCategory(categoryName);
      const post = await this.postRepository.create({
        title,
        summary,
        content,
        published,
        image,
        category,
        user,
      })
      await this.postRepository.save(post);
      return {
        ok: true,
      }
    } catch (error) {
      return { ok: false, error: "Cannot create post." }
    }
  }

  async findAll ({ limit = DEFAULT_POSTS_PER_PAGE, pageNumber = DEFAULT_PAGE_NUMBER }: GetAllPostsDto): Promise<GetAllPostsOutput> {
    try {
      const totalPosts = await this.postRepository.count();

      const totalPages = Math.ceil(totalPosts / limit);

      if (pageNumber > totalPages) {
        throw new HttpException('Page index out of bound.', HttpStatus.BAD_REQUEST)
      }

      const posts = await this.postRepository.find({
        order: {
          createdAt: "DESC"
        },
        take: limit,
        skip: (pageNumber * limit - limit),
      });


      return {
        data: {
          posts,
          totalPages: totalPages,
          totalItems: totalPosts,
          limit: limit,
          currentPageItems: posts.length,
          currentPage: pageNumber,
        },
        ok: true,
      };

    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return { ok: false, error: "Cannot create post." }
    }
  }

  publish () { }

  postByCategory () { }

  postByUser () { }

  findOne (id: number) {
    return `This action returns a #${id} post`;
  }

  update (id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove (id: number) {
    return `This action removes a #${id} post`;
  }
}

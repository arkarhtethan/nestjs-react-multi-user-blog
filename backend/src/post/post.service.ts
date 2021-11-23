import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, CreatePostOutput } from './dto/create-post.dto';
import { GetAllPostsDto, GetAllPostsOutput } from './dto/get-posts.dto';
import { UpdatePostDto, UpdatePostOutput } from './dto/update-post.dto';
import { Category } from './entities/category.entity';
import { Post } from './entities/post.entity';
import { DEFAULT_POSTS_PER_PAGE, DEFAULT_PAGE_NUMBER } from '../common/constants'
import { GetPostOutput } from './dto/get-post.dto';
import { GetAllPostsByCategoryDto, GetAllPostsByCategoryOutput } from './dto/get-posts-by-category.dto';
import { GetAllPostsByUserDto, GetAllPostsByUserOutput } from './dto/get-posts-by-user.dto';
import { GetAllMyPostsDto, GetAllMyPostsOutput } from './dto/my-post.dto';
import { DeletePostOutput } from './dto/delete-post.dto';
import { CategoryListOutput } from './dto/category-list.dto';
import { CoreOutput } from 'src/common/dtos/core.output';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      const totalPosts = await this.postRepository.count({ where: { published: true } });
      const totalPages = Math.ceil(totalPosts / limit);
      if (pageNumber > totalPages) {
        throw new HttpException('Page index out of bound.', HttpStatus.BAD_REQUEST)
      }
      const posts = await this.postRepository.find({
        order: {
          id: "DESC"
        },
        take: limit,
        skip: (pageNumber * limit - limit),
        relations: ['category', 'user'],
        where: {
          published: true,
        }
      });

      return {
        data: {
          totalPages: totalPages,
          totalItems: totalPosts,
          limit: limit,
          currentPageItems: posts.length,
          currentPage: pageNumber,
          posts,
        },
        ok: true,
      };

    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return { ok: false, error: "Cannot get posts." }
    }
  }

  async myPost (user: User, { limit = DEFAULT_POSTS_PER_PAGE, pageNumber = DEFAULT_PAGE_NUMBER }: GetAllMyPostsDto): Promise<GetAllMyPostsOutput> {
    try {
      const totalPosts = await this.postRepository.count({ user });
      const totalPages = Math.ceil(totalPosts / limit);
      if (pageNumber > totalPages) {
        throw new HttpException('Page index out of bound.', HttpStatus.BAD_REQUEST)
      }
      const posts = await this.postRepository.find({
        order: {
          id: "DESC"
        },
        take: limit,
        skip: (pageNumber * limit - limit),
        relations: ['category'],
        where: { user }
      });

      return {
        data: {
          totalPages: totalPages,
          totalItems: totalPosts,
          limit: limit,
          currentPageItems: posts.length,
          currentPage: pageNumber,
          posts,
        },
        ok: true,
      };

    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return { ok: false, error: "Cannot get posts." }
    }
  }

  async publish (
    id: number,
    user: User
  ): Promise<CoreOutput> {
    try {
      const post = await this.postRepository.findOne({ id }, { relations: ['user'] });
      if (!post) {
        throw new HttpException('Post not found.', HttpStatus.NOT_FOUND)
      }
      if (post.user.id !== user.id) {
        throw new HttpException('Permission Denied.', HttpStatus.UNAUTHORIZED)
      }
      post.published = true;
      await this.postRepository.save(post);
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't publish post."
      }
    }
  }

  async categoryList (): Promise<CategoryListOutput> {
    try {
      const categories = await this.categoryRepository.find();
      return {
        ok: true,
        categories,
      }
    } catch (error) {
      return {
        ok: false,
        error: "Can't get all categories."
      }
    }
  }

  async postsByCategory (categorySlug: string, { limit = DEFAULT_POSTS_PER_PAGE, pageNumber = DEFAULT_PAGE_NUMBER }: GetAllPostsByCategoryDto): Promise<GetAllPostsByCategoryOutput> {
    try {
      const category = await this.categoryRepository.findOne({ slug: categorySlug })

      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND)
      }

      const totalPosts = await this.postRepository.count({ where: { category, published: true } });
      const totalPages = Math.ceil(totalPosts / limit);
      const posts = await this.postRepository.find({
        where: { category, published: true },
        relations: ['category', 'user'],
        take: limit,
        order: {
          id: "DESC"
        },
        skip: (pageNumber * limit - limit),
      });

      return {
        ok: true,
        data: {
          limit,
          totalPages,
          category,
          totalItems: totalPosts,
          currentPage: pageNumber,
          currentPageItems: posts.length,
          posts,
        }
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't get posts by category."
      }
    }
  }

  async postByUser (username: string, { limit = DEFAULT_POSTS_PER_PAGE, pageNumber = DEFAULT_PAGE_NUMBER }: GetAllPostsByUserDto): Promise<GetAllPostsByUserOutput> {
    try {
      const user = await this.userRepository.findOne({ username })

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

      const totalPosts = await this.postRepository.count({ where: { user: user, published: true } });
      const totalPages = Math.ceil(totalPosts / limit);
      if (pageNumber > totalPages) {
        throw new HttpException('Page index out of bound.', HttpStatus.BAD_REQUEST)
      }
      const posts = await this.postRepository.find({
        where: { user, published: true },
        relations: ['category', 'user'],
        take: limit,
        order: {
          id: "DESC"
        },
        skip: (pageNumber * limit - limit),
      });

      return {
        ok: true,
        data: {
          limit,
          totalPages,
          user,
          totalItems: totalPosts,
          currentPage: pageNumber,
          currentPageItems: posts.length,
          posts,
        }
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't get posts by category."
      }
    }
  }

  async findOne (id: number): Promise<GetPostOutput> {
    try {
      const post = await this.postRepository.findOne({ id }, { relations: ['user', 'category'] })
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
      }
      return {
        ok: true,
        post,
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't get post."
      }
    }
  }

  async update (id: number, updatePostDto: UpdatePostDto, user: User): Promise<UpdatePostOutput> {
    try {
      const post = await this.postRepository.findOne({ id }, { relations: ['user'] })
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
      }
      if (post.user.id !== user.id) {
        throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED)
      }
      const { category } = updatePostDto;
      let categoryObject;
      if (category) {
        categoryObject = await this.getOrCreateCategory(category);
      }
      await this.postRepository.save(this.postRepository.create([
        {
          id,
          ...updatePostDto,
          ...(category && { category: categoryObject })
        }
      ]))
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't update post."
      }
    }
  }

  async remove (id: number, user: User): Promise<DeletePostOutput> {
    try {
      const post = await this.postRepository.findOne({ id }, { relations: ['user'] });
      if (!post) {
        throw new HttpException('Post not found.', HttpStatus.NOT_FOUND)
      }
      if (!((post.user.id === user.id) || (user.role === UserRole.Admin))) {
        throw new HttpException("Permission Denied.", HttpStatus.UNAUTHORIZED);
      }
      await this.postRepository.delete(id);
      return {
        ok: true
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't remove post."
      }
    }
  }
}

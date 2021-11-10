import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, CreatePostOutput } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Category } from './entities/category.entity';
import { Post } from './entities/post.entity';

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

  findAll () {
    try {

    } catch (error) {
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

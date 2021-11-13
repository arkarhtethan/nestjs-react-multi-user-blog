import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core.output';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentOutput } from './dto/get-comment.dto';
import { GetCommentsByPostIdOutput } from './dto/get-comments-by-post.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) { }

  async create ({ postId, text, parentId }: CreateCommentDto, user: User): Promise<CoreOutput> {
    try {
      const post = await this.postRepository.findOne({ id: postId })
      if (!post) {
        throw new HttpException('Post which you are trying to add comment is not found.', HttpStatus.NOT_FOUND)
      }
      const comment = await this.commentRepository.create({ text, post, user })
      if (parentId) {
        const parentComment = await this.commentRepository.findOne({ id: parentId });
        if (!parentComment) {
          throw new HttpException('Comment which you are trying to reply is not found.', HttpStatus.NOT_FOUND)
        }
        comment.parent = parentComment;
      }
      await this.commentRepository.save(comment);
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Cannot create comment."
      }
    }
  }

  async commentByPostId (postId: number): Promise<GetCommentsByPostIdOutput> {
    try {
      const post = await this.postRepository.findOne({ id: postId })
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
      }
      const comments = await this.commentRepository.find({ where: { post, parent: null }, relations: ['parent', 'children'] })
      return {
        ok: true,
        comments,
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false
      }
    }
  }

  async findOne (id: number): Promise<GetCommentOutput> {
    try {
      const comment = await this.commentRepository.findOne({ id }, { relations: ['children'] });
      if (!comment) {
        throw new HttpException("Comment not found.", HttpStatus.NOT_FOUND)
      }
      return {
        ok: true,
        comment
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
      }
    }
  }

  async update (id: number, updateCommentDto: UpdateCommentDto, user: User): Promise<CoreOutput> {
    try {
      const comment = await this.commentRepository.findOne({ id });
      if (!comment) {
        throw new HttpException('Comment you are trying to update is no longer exists.', HttpStatus.NOT_FOUND)
      }
      if (comment.user.id !== user.id) {
        throw new HttpException('Permission Denied.', HttpStatus.UNAUTHORIZED)
      }
      await this.commentRepository.save([
        this.commentRepository.create({
          ...comment,
          ...updateCommentDto,
        })
      ])
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
      }
    }
  }

  async remove (id: number, user: User): Promise<CoreOutput> {
    try {
      const comment = await this.commentRepository.findOne({ id });
      if (!comment) {
        throw new HttpException('Comment you are trying to delete is no longer exists.', HttpStatus.NOT_FOUND)
      }
      if (comment.user.id !== user.id) {
        throw new HttpException('Permission Denied.', HttpStatus.UNAUTHORIZED)
      }
      await this.commentRepository.delete({ id })
      return {
        ok: true,
      }
    } catch (error) {
      if (error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
      }
    }
  }
}

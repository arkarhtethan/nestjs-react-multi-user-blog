import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core.output';
import { Post } from 'src/post/entities/post.entity';
import { postStub } from 'src/post/test/stub/post.stub';
import { MockPostRepository } from 'src/post/__mocks__/post.repository';
import { User } from 'src/user/entities/user.entity';
import { getUserStub } from 'src/user/test/stubs/user.stub';
import { Repository } from 'typeorm';
import { CommentService } from '../comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { GetCommentOutput } from '../dto/get-comment.dto';
import { GetCommentsByPostIdOutput } from '../dto/get-comments-by-post.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Comment } from '../entities/comment.entity';
import { MockCommentRepository } from '../__mocks__/mock.comment.repository';
import { commentStub } from './stub/comment.stub';

type MockRepoitory<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CommentService', () => {
  let service: CommentService;
  let postRepository: MockRepoitory<Post>;
  let commentRepository: MockRepoitory<Comment>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: MockCommentRepository,
        },
        {
          provide: getRepositoryToken(Post),
          useValue: MockPostRepository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    postRepository = module.get(getRepositoryToken(Post));
    commentRepository = module.get(getRepositoryToken(Comment));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    describe("when create() is called ", () => {
      const createCommentDto: CreateCommentDto = {
        postId: 1,
        text: "aslkfsalkdjf",
      };
      const user: User = getUserStub();
      let createCommentOutput: CoreOutput;
      beforeEach(() => {
        createCommentOutput = null;
        jest.clearAllMocks();
      })
      it("should fail on post not found.", async () => {
        postRepository.findOne.mockReturnValueOnce(null);
        try {
          createCommentOutput = await service.create(createCommentDto, user)
        } catch (error) {
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Post which you are trying to add comment is not found.");
          expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        }
      })
      it("should fail on error.", async () => {
        postRepository.findOne.mockRejectedValueOnce(new Error());
        createCommentOutput = await service.create(createCommentDto, user)
        expect(createCommentOutput.ok).toEqual(false);
        expect(createCommentOutput.error).toEqual("Cannot create comment.")
      })
      it("should create comment.", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub);
        createCommentOutput = await service.create(createCommentDto, user)

        expect(createCommentOutput.ok).toEqual(true);
        expect(createCommentOutput.error).toBeUndefined()

        expect(commentRepository.create).toHaveBeenCalledTimes(1);
        expect(commentRepository.save).toHaveBeenCalledTimes(1);
      })

      it("should create comment.", async () => {

        postRepository.findOne.mockResolvedValueOnce(postStub);
        commentRepository.findOne.mockResolvedValueOnce(commentStub);
        commentRepository.create.mockResolvedValueOnce(commentStub);

        createCommentOutput = await service.create({ ...createCommentDto, text: "hello", parentId: 1 }, user)

        expect(createCommentOutput.ok).toEqual(true);
        expect(createCommentOutput.error).toBeUndefined()

        expect(postRepository.findOne).toHaveBeenCalledTimes(1);
        expect(commentRepository.findOne).toHaveBeenCalledTimes(1);
        expect(commentRepository.create).toHaveBeenCalledTimes(1);
        expect(commentRepository.save).toHaveBeenCalledTimes(1);
      })

      it("should fail when parent comment not found.", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub);
        commentRepository.findOne.mockResolvedValueOnce(null);
        try {
          createCommentOutput = await service.create({ ...createCommentDto, parentId: 1 }, user)
        } catch (error) {
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Comment which you are trying to reply is not found.");
          expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        }
      })
    })
  });

  describe("findOne", () => {
    describe("when findOne() is called ", () => {
      let getCommentOutput: GetCommentOutput;
      beforeEach(() => {
        jest.clearAllMocks();
        getCommentOutput = null;
      })
      it("should fail on comment not found.", async () => {
        commentRepository.findOne.mockResolvedValueOnce(null);
        try {
          getCommentOutput = await service.findOne(1)
        } catch (error) {
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Comment not found.");
          expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        }
      })

      it("should fail on error.", async () => {
        commentRepository.findOne.mockRejectedValue(new Error());
        getCommentOutput = await service.findOne(2)
        expect(getCommentOutput.ok).toEqual(false);
        expect(getCommentOutput.error).toEqual("Cannot get comment for given id.")
      })

      it("should return all comments.", async () => {
        commentRepository.findOne.mockResolvedValueOnce(commentStub);
        getCommentOutput = await service.findOne(11)

        expect(getCommentOutput.ok).toEqual(true);
        expect(getCommentOutput.error).toBeUndefined()
        expect(getCommentOutput.comment).toEqual(commentStub)

        expect(commentRepository.findOne).toHaveBeenCalledTimes(1);
      })
    })
  });

  describe("commentByPostId", () => {
    describe("when commentByPostId() is called ", () => {
      let getCommentsByPostIdOutput: GetCommentsByPostIdOutput;
      beforeEach(() => {
        jest.clearAllMocks();
        getCommentsByPostIdOutput = null;
      })

      it("should fail on comment not found.", async () => {
        postRepository.findOne.mockReturnValueOnce(null);
        try {
          getCommentsByPostIdOutput = await service.commentByPostId(1)
        } catch (error) {
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Post not found.");
          expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        }
      })
      it("should fail on error.", async () => {
        postRepository.findOne.mockRejectedValueOnce(new Error());
        getCommentsByPostIdOutput = await service.commentByPostId(1)
        expect(getCommentsByPostIdOutput.ok).toEqual(false);
        expect(getCommentsByPostIdOutput.error).toEqual("Cannt get comments for given post.")
      })

      it("should return all comments.", async () => {

        postRepository.findOne.mockResolvedValueOnce(postStub);
        commentRepository.find.mockReturnValueOnce({ ...commentStub, text: "testA" });
        commentRepository.create.mockResolvedValueOnce(commentStub);

        getCommentsByPostIdOutput = await service.commentByPostId(1)

        expect(getCommentsByPostIdOutput.ok).toEqual(true);
        expect(getCommentsByPostIdOutput.error).toBeUndefined()

        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

        expect(commentRepository.find).toHaveBeenCalledTimes(1);
      })
    })
  });

  describe("update", () => {
    describe("when update() is called ", () => {
      let updateCommentOuput: CoreOutput;
      const updateCommentDto: UpdateCommentDto = {
        text: "haha"
      }
      const user: User = getUserStub() as User;
      beforeEach(() => {
        jest.clearAllMocks();
        updateCommentOuput = null;
      })

      it("should fail on comment not found.", async () => {
        commentRepository.findOne.mockReturnValueOnce(null);
        try {
          updateCommentOuput = await service.update(1, updateCommentDto, user)
        } catch (error) {
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Comment you are trying to update is no longer exists.");
          expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        }
      })

      it("should fail on error.", async () => {
        commentRepository.findOne.mockRejectedValueOnce(new Error());
        updateCommentOuput = await service.update(1, updateCommentDto, user)
        expect(updateCommentOuput.ok).toEqual(false);
        expect(updateCommentOuput.error).toEqual("Cannot update comment.")
      })

      it("should update comment.", async () => {

        commentRepository.findOne.mockReturnValueOnce({ ...commentStub, text: "testA" });
        commentRepository.create.mockResolvedValueOnce(commentStub);

        updateCommentOuput = await service.update(1, updateCommentDto, user)

        expect(updateCommentOuput.ok).toEqual(true);
        expect(updateCommentOuput.error).toBeUndefined()

        expect(commentRepository.findOne).toHaveBeenCalledTimes(1);

        expect(commentRepository.save).toHaveBeenCalledTimes(1);
        expect(commentRepository.create).toHaveBeenCalledTimes(1);
      })

      it("should fail on ownership condition failed.", async () => {

        commentRepository.findOne.mockReturnValueOnce({ ...commentStub, text: "testA" });
        try {
          updateCommentOuput = await service.update(1, updateCommentDto, { ...user, id: 21 } as User)
        } catch (error) {

          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Permission Denied.")
          expect(error.status).toEqual(HttpStatus.UNAUTHORIZED)
          expect(commentRepository.findOne).toHaveBeenCalledTimes(1);
        }


      })
    })
  });

  describe("remove", () => {
    describe("when remove() is called ", () => {
      let removeCommentOuput: CoreOutput;
      const user: User = getUserStub() as User;
      beforeEach(() => {
        jest.clearAllMocks();
        removeCommentOuput = null;
      })

      it("should fail on comment not found.", async () => {
        commentRepository.findOne.mockReturnValueOnce(null);
        try {
          removeCommentOuput = await service.remove(1, user)
        } catch (error) {
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Comment you are trying to delete is no longer exists.");
          expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        }
      })

      it("should fail on error.", async () => {
        commentRepository.findOne.mockRejectedValueOnce(new Error());
        removeCommentOuput = await service.remove(1, user)
        expect(removeCommentOuput.ok).toEqual(false);
        expect(removeCommentOuput.error).toEqual("Cannot remove comment.")
      })

      it("should delete comment.", async () => {

        commentRepository.findOne.mockReturnValueOnce({ ...commentStub, text: "testA" });

        removeCommentOuput = await service.remove(1, user)

        expect(removeCommentOuput.ok).toEqual(true);
        expect(removeCommentOuput.error).toBeUndefined()

        expect(commentRepository.findOne).toHaveBeenCalledTimes(1);

        expect(commentRepository.delete).toHaveBeenCalledTimes(1);
      })

      it("should fail on ownership condition failed.", async () => {

        commentRepository.findOne.mockReturnValueOnce({ ...commentStub, text: "testA" });
        try {
          removeCommentOuput = await service.remove(1, { ...user, id: 21 } as User)
        } catch (error) {

          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Permission Denied.")
          expect(error.status).toEqual(HttpStatus.UNAUTHORIZED)
          expect(commentRepository.findOne).toHaveBeenCalledTimes(1);
        }


      })
    })
  });
});

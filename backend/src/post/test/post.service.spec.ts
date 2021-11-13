import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core.output';
import { User, UserRole } from 'src/user/entities/user.entity';
import { getUserStub } from 'src/user/test/stubs/user.stub';
import { MockUserRepoitory } from 'src/user/__mocks__/user.repository';
import { Repository } from 'typeorm';
import { CategoryListOutput } from '../dto/category-list.dto';
import { CreatePostDto, CreatePostOutput } from '../dto/create-post.dto';
import { DeletePostOutput } from '../dto/delete-post.dto';
import { GetPostOutput } from '../dto/get-post.dto';
import { GetAllPostsByCategoryOutput } from '../dto/get-posts-by-category.dto';
import { GetAllPostsByUserOutput } from '../dto/get-posts-by-user.dto';
import { GetAllPostsOutput } from '../dto/get-posts.dto';
import { GetAllMyPostsOutput } from '../dto/my-post.dto';
import { UpdatePostOutput } from '../dto/update-post.dto';
import { Category } from '../entities/category.entity';
import { Post } from '../entities/post.entity';
import { PostService } from '../post.service';
import { MockCategoryRepository } from '../__mocks__/category.repository';
import { MockPostRepository } from '../__mocks__/post.repository';
import { categoryStub } from './stub/category.stub';
import { postStub } from './stub/post.stub';

type MockRepoitory<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PostService', () => {
  let postService: PostService;
  let postRepository: MockRepoitory<Post>;
  let categoryRepository: MockRepoitory<Category>;
  let userRepository: MockRepoitory<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(User),
          useValue: MockUserRepoitory,
        },
        {
          provide: getRepositoryToken(Post),
          useValue: MockPostRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: MockCategoryRepository,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get(getRepositoryToken(Post));
    categoryRepository = module.get(getRepositoryToken(Category));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('create()', () => {
    describe('when create method is called.', () => {
      const postDto: CreatePostDto = {
        title: "asdf",
        category: "asd",
        summary: "asd",
        image: "asd",
        published: false,
        content: "asdflksadf",
      };
      let postCreateOutput: CreatePostOutput;
      let user: User = getUserStub() as User;
      beforeEach(() => {
        jest.clearAllMocks();
        postCreateOutput = null;
      })
      it("should create a new post.", async () => {
        const postCreateOutput = await postService.create(postDto, user);

        expect(postCreateOutput.ok).toEqual(true);
        expect(postCreateOutput.error).toBeUndefined();

        expect(postRepository.create).toHaveBeenCalledTimes(1);

        expect(postRepository.save).toHaveBeenCalledTimes(1);

        expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
        expect(categoryRepository.create).toHaveBeenCalledTimes(1);
        expect(categoryRepository.save).toHaveBeenCalledTimes(1);
      })

      it("should fail on error.", async () => {
        postRepository.create.mockRejectedValueOnce(new Error())
        const postCreateOutput = await postService.create(postDto, user);

        expect(postCreateOutput.ok).toEqual(false);
        expect(postCreateOutput.error).toEqual("Cannot create post.");
      })
    })

  });

  describe('findAll()', () => {
    describe('when findAll() is called', () => {
      let postsOutput: GetAllPostsOutput;

      beforeEach(() => {
        postsOutput = null;
        jest.resetAllMocks();
      })

      it("should return all posts", async () => {
        postRepository.find.mockResolvedValueOnce([])
        postsOutput = await postService.findAll({});

        expect(postsOutput.ok).toBe(true);
        expect(postsOutput.error).toBeUndefined();
        expect(postsOutput.data).toBeDefined();
        expect(postsOutput.data.posts).toBeDefined();

        expect(postRepository.find).toHaveBeenCalledTimes(1);
        expect(postRepository.count).toHaveBeenCalledTimes(1);

      })

      it("should fail on error.", async () => {
        postRepository.find.mockRejectedValueOnce(new Error())
        postsOutput = await postService.findAll({});

        expect(postsOutput.ok).toBe(false);
        expect(postsOutput.error).toEqual('Cannot get posts.');
        expect(postsOutput.data).toBeUndefined();

        expect(postRepository.find).toHaveBeenCalledTimes(1);
        expect(postRepository.count).toHaveBeenCalledTimes(1);

      })

      it("should fail pagenumber is greater than original pagenumber.", async () => {
        postRepository.find.mockResolvedValueOnce([])
        postRepository.count.mockResolvedValueOnce(1)
        try {
          postsOutput = await postService.findAll({ pageNumber: 10 });
        } catch (error) {
          expect(postRepository.count).toHaveBeenCalledTimes(1);
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Page index out of bound.")
          expect(error.status).toEqual(HttpStatus.BAD_REQUEST)
        }

      })
    })

  });

  describe('myPost', () => {
    describe('when myPost() is called', () => {
      let myPostOutput: GetAllMyPostsOutput;

      beforeEach(() => {
        myPostOutput = null;
        jest.resetAllMocks();
      })

      it("should return all posts", async () => {
        postRepository.find.mockResolvedValueOnce([])
        myPostOutput = await postService.myPost(getUserStub() as User, {});

        expect(myPostOutput.ok).toBe(true);
        expect(myPostOutput.error).toBeUndefined();
        expect(myPostOutput.data).toBeDefined();
        expect(myPostOutput.data.posts).toBeDefined();

        expect(postRepository.find).toHaveBeenCalledTimes(1);
        expect(postRepository.count).toHaveBeenCalledTimes(1);

      })

      it("should fail on error.", async () => {
        postRepository.find.mockRejectedValueOnce(new Error())
        myPostOutput = await postService.myPost(getUserStub() as User, {});

        expect(myPostOutput.ok).toBe(false);
        expect(myPostOutput.error).toEqual('Cannot get posts.');
        expect(myPostOutput.data).toBeUndefined();

        expect(postRepository.find).toHaveBeenCalledTimes(1);
        expect(postRepository.count).toHaveBeenCalledTimes(1);

      })

      it("should fail pagenumber is greater than original pagenumber.", async () => {
        postRepository.find.mockResolvedValueOnce([])
        postRepository.count.mockResolvedValueOnce(1)
        try {
          myPostOutput = await postService.myPost(getUserStub() as User, { pageNumber: 10 });
        } catch (error) {
          expect(postRepository.count).toHaveBeenCalledTimes(1);
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Page index out of bound.")
          expect(error.status).toEqual(HttpStatus.BAD_REQUEST)
        }
      })
    })
  });

  describe('publish', () => {
    describe('when publish() is called', () => {
      let publishOutput: CoreOutput;

      beforeEach(() => {
        publishOutput = null;
        jest.resetAllMocks();
      })

      it("should return all posts", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub)
        publishOutput = await postService.publish(1, getUserStub() as User);

        expect(publishOutput.ok).toBe(true);
        expect(publishOutput.error).toBeUndefined();

        expect(postRepository.findOne).toHaveBeenCalledTimes(1);
      })

      it("should fail on error.", async () => {
        postRepository.findOne.mockRejectedValueOnce(new Error())
        publishOutput = await postService.publish(1, getUserStub() as User);

        expect(publishOutput.ok).toBe(false);
        expect(publishOutput.error).toEqual("Can't publish post.");

        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

      })

      it("should fail when post not found.", async () => {
        postRepository.findOne.mockResolvedValueOnce(null)
        try {
          publishOutput = await postService.publish(1, getUserStub() as User);
        } catch (error) {
          expect(postRepository.findOne).toHaveBeenCalledTimes(1);
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Post not found.")
          expect(error.status).toEqual(HttpStatus.NOT_FOUND)
        }
      })

      it("should fail on permission denied.", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub)
        try {
          publishOutput = await postService.publish(1, { ...getUserStub(), id: 4 } as User);
        } catch (error) {
          expect(postRepository.findOne).toHaveBeenCalledTimes(1);
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Permission Denied.")
          expect(error.status).toEqual(HttpStatus.UNAUTHORIZED)

        }
      })
    })
  });

  describe('categoryList()', () => {
    describe('when categoryList() is called', () => {
      let categoryListOutput: CategoryListOutput;

      beforeEach(() => {
        categoryListOutput = null;
        jest.resetAllMocks();
      })

      it("should return all posts", async () => {
        categoryRepository.find.mockResolvedValueOnce([categoryStub])
        categoryListOutput = await postService.categoryList();

        expect(categoryListOutput.ok).toBe(true);
        expect(categoryListOutput.error).toBeUndefined();
        expect(categoryListOutput.categories).toHaveLength(1)


        expect(categoryRepository.find).toHaveBeenCalledTimes(1);

      })

      it("should fail on error.", async () => {
        categoryRepository.find.mockRejectedValueOnce(new Error())
        categoryListOutput = await postService.categoryList();

        expect(categoryListOutput.ok).toBe(false);
        expect(categoryListOutput.error).toEqual("Can't get all categories.");
        expect(categoryListOutput.categories).toBeUndefined();

        expect(categoryRepository.find).toHaveBeenCalledTimes(1);

      })
    })

  });

  describe('postsByCategory', () => {
    describe('when postsByCategory() is called', () => {
      let postsByCategoryOutput: GetAllPostsByCategoryOutput;

      beforeEach(() => {
        postsByCategoryOutput = null;
        jest.resetAllMocks();
      })

      it("should fail on error.", async () => {
        categoryRepository.findOne.mockRejectedValueOnce(new Error())
        postsByCategoryOutput = await postService.postsByCategory('asdf', {});

        expect(postsByCategoryOutput.ok).toBe(false);
        expect(postsByCategoryOutput.error).toEqual("Can't get posts by category.");
        expect(postsByCategoryOutput.data).toBeUndefined();

        expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);

      })

      it("should fail category not found..", async () => {
        categoryRepository.findOne.mockResolvedValueOnce(null)
        try {
          postsByCategoryOutput = await postService.postsByCategory('asdf', {});
        } catch (error) {
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Category not found")
          expect(error.status).toEqual(HttpStatus.NOT_FOUND)
          expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
        }
      })

      it("should fail pagenumber is greater than original pagenumber.", async () => {
        categoryRepository.findOne.mockResolvedValueOnce(categoryStub)
        postRepository.find.mockResolvedValueOnce([])
        postRepository.count.mockResolvedValueOnce(1)
        try {
          postsByCategoryOutput = await postService.postsByCategory('asdf', { pageNumber: 10 });
        } catch (error) {
          expect(postRepository.count).toHaveBeenCalledTimes(1);
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Page index out of bound.")
          expect(error.status).toEqual(HttpStatus.BAD_REQUEST)
        }

      })

      it("should return all posts", async () => {
        categoryRepository.findOne.mockResolvedValueOnce(categoryStub)
        postRepository.find.mockResolvedValueOnce([postStub])
        postRepository.count.mockResolvedValueOnce(1)
        postsByCategoryOutput = await postService.postsByCategory('asdf', {});

        expect(postsByCategoryOutput.ok).toBe(true)
        expect(postsByCategoryOutput.error).toBeUndefined();
        expect(postsByCategoryOutput.data).toBeDefined();
        expect(postsByCategoryOutput.data.posts).toHaveLength(1);

        expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
        expect(postRepository.count).toHaveBeenCalledTimes(1);
        expect(postRepository.find).toHaveBeenCalledTimes(1);

      })
    })
  });

  describe('postByUser', () => {
    describe('when postByUser() is called', () => {
      let postByUserOutput: GetAllPostsByUserOutput;

      beforeEach(() => {
        postByUserOutput = null;
        jest.resetAllMocks();
      })

      it("should fail on error.", async () => {
        userRepository.findOne.mockRejectedValueOnce(new Error())
        postByUserOutput = await postService.postByUser('asdf', {});

        expect(postByUserOutput.ok).toBe(false);
        expect(postByUserOutput.error).toEqual("Can't get posts by category.");
        expect(postByUserOutput.data).toBeUndefined();

        expect(userRepository.findOne).toHaveBeenCalledTimes(1);

      })

      it("should fail category not found..", async () => {
        userRepository.findOne.mockResolvedValueOnce(null)
        try {
          postByUserOutput = await postService.postByUser('asdf', {});
        } catch (error) {
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("User not found")
          expect(error.status).toEqual(HttpStatus.NOT_FOUND)
          expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        }
      })

      it("should fail pagenumber is greater than original pagenumber.", async () => {
        userRepository.findOne.mockResolvedValueOnce(getUserStub())
        postRepository.find.mockResolvedValueOnce([])
        postRepository.count.mockResolvedValueOnce(1)
        try {
          postByUserOutput = await postService.postByUser('asdf', { pageNumber: 10 });
        } catch (error) {
          expect(postRepository.count).toHaveBeenCalledTimes(1);
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Page index out of bound.")
          expect(error.status).toEqual(HttpStatus.BAD_REQUEST)
        }

      })

      it("should return all posts", async () => {
        userRepository.findOne.mockResolvedValueOnce(getUserStub())
        postRepository.find.mockResolvedValueOnce([postStub])
        postRepository.count.mockResolvedValueOnce(1)
        postByUserOutput = await postService.postByUser('asdf', {});

        expect(postByUserOutput.ok).toBe(true)
        expect(postByUserOutput.error).toBeUndefined();
        expect(postByUserOutput.data).toBeDefined();
        expect(postByUserOutput.data.posts).toHaveLength(1);

        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(postRepository.count).toHaveBeenCalledTimes(1);
        expect(postRepository.find).toHaveBeenCalledTimes(1);

      })
    })
  });

  describe('findOne', () => {
    describe('when findOne() is called', () => {
      let findOneOutput: GetPostOutput;

      beforeEach(() => {
        findOneOutput = null;
        jest.resetAllMocks();
      })

      it("should fail on error.", async () => {
        postRepository.findOne.mockRejectedValueOnce(new Error())
        findOneOutput = await postService.findOne(1);

        expect(findOneOutput.ok).toBe(false);
        expect(findOneOutput.error).toEqual("Can't get post.");
        expect(findOneOutput.post).toBeUndefined();

        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

      })

      it("should fail post not found..", async () => {
        postRepository.findOne.mockResolvedValueOnce(null)
        try {
          findOneOutput = await postService.findOne(1);
        } catch (error) {
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Post not found")
          expect(error.status).toEqual(HttpStatus.NOT_FOUND)
          expect(postRepository.findOne).toHaveBeenCalledTimes(1);
        }
      })


      it("should return post by id", async () => {
        postRepository.findOne.mockResolvedValueOnce([postStub])
        findOneOutput = await postService.findOne(1);

        expect(findOneOutput.ok).toBe(true)
        expect(findOneOutput.error).toBeUndefined();
        expect(findOneOutput.post).toBeDefined();

        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

      })
    })
  });

  describe('update', () => {
    describe('when update() is called', () => {
      let updateOutput: UpdatePostOutput;

      beforeEach(() => {
        updateOutput = null;
        jest.resetAllMocks();
      })

      it("should fail on error.", async () => {
        postRepository.findOne.mockRejectedValueOnce(new Error())
        updateOutput = await postService.update(1, { title: "updated" }, getUserStub() as User);

        expect(updateOutput.ok).toBe(false);
        expect(updateOutput.error).toEqual("Can't update post.");

        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

      })

      it("should fail on permission denied.", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub)
        try {
          updateOutput = await postService.update(1, { title: "updated" }, { ...getUserStub(), id: 4 } as User);
        } catch (error) {
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Permission Denied")
          expect(error.status).toEqual(HttpStatus.UNAUTHORIZED)
          expect(postRepository.findOne).toHaveBeenCalledTimes(1);
        }
      })

      it("should fail post not found..", async () => {
        postRepository.findOne.mockResolvedValueOnce(null)
        try {
          updateOutput = await postService.update(1, { title: "updated" }, getUserStub() as User);
        } catch (error) {
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Post not found")
          expect(error.status).toEqual(HttpStatus.NOT_FOUND)
          expect(postRepository.findOne).toHaveBeenCalledTimes(1);
        }
      })

      it("should update post without creating category", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub)
        updateOutput = await postService.update(1, { title: "updated" }, getUserStub() as User);

        expect(updateOutput.ok).toBe(true)
        expect(updateOutput.error).toBeUndefined();

        expect(postRepository.create).toHaveBeenCalledTimes(1);
        expect(postRepository.save).toHaveBeenCalledTimes(1);
        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

        expect(categoryRepository.create).toHaveBeenCalledTimes(0);

      })

      it("should update post by creating category", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub)
        updateOutput = await postService.update(1, { title: "updated", category: "asdf" }, getUserStub() as User);

        expect(updateOutput.ok).toBe(true)
        expect(updateOutput.error).toBeUndefined();

        expect(postRepository.create).toHaveBeenCalledTimes(1);
        expect(postRepository.save).toHaveBeenCalledTimes(1);
        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

        expect(categoryRepository.create).toHaveBeenCalledTimes(1);

      })

    })
  });

  describe('remove', () => {
    describe('when remove() is called', () => {
      let removeOutput: DeletePostOutput;

      beforeEach(() => {
        removeOutput = null;
        jest.resetAllMocks();
      })

      it("should fail on error.", async () => {
        postRepository.findOne.mockRejectedValueOnce(new Error())
        removeOutput = await postService.remove(1, getUserStub() as User);

        expect(removeOutput.ok).toBe(false);
        expect(removeOutput.error).toEqual("Can't remove post.");

        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

      })

      it("should fail on permission denied.", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub)
        try {
          removeOutput = await postService.remove(1, { ...getUserStub(), id: 4 } as User);
        } catch (error) {
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Permission Denied.")
          expect(error.status).toEqual(HttpStatus.UNAUTHORIZED)
          expect(postRepository.findOne).toHaveBeenCalledTimes(1);
        }
      })

      it("should fail when post not found..", async () => {
        postRepository.findOne.mockResolvedValueOnce(null)
        try {
          removeOutput = await postService.remove(1, getUserStub() as User);
        } catch (error) {
          expect(error.name).toEqual("HttpException")
          expect(error.message).toEqual("Post not found.")
          expect(error.status).toEqual(HttpStatus.NOT_FOUND)
          expect(postRepository.findOne).toHaveBeenCalledTimes(1);
        }
      })

      it("should remove post by id when when user is admin", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub)
        removeOutput = await postService.remove(1, { ...getUserStub(), id: 4, role: UserRole.Admin } as User);

        expect(removeOutput.ok).toBe(true)
        expect(removeOutput.error).toBeUndefined();

        expect(postRepository.delete).toHaveBeenCalledTimes(1);
        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

      })

      it("should remove post by id", async () => {
        postRepository.findOne.mockResolvedValueOnce(postStub)
        removeOutput = await postService.remove(1, getUserStub() as User);

        expect(removeOutput.ok).toBe(true)
        expect(removeOutput.error).toBeUndefined();

        expect(postRepository.delete).toHaveBeenCalledTimes(1);
        expect(postRepository.findOne).toHaveBeenCalledTimes(1);

      })

    })
  });

});

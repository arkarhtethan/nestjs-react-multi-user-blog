import { categoryStub } from "../test/stub/category.stub";
import { postStub } from "../test/stub/post.stub";

export const PostService = jest.fn().mockReturnValue({
    create: jest.fn().mockReturnValue({ ok: true }),
    findAll: jest.fn().mockReturnValue({
        ok: true,
        data: {
            totalPages: 1,
            totalItems: 2,
            limit: 3,
            currentPageItems: 2,
            currentPage: 1,
            posts: [postStub],
        }
    }),
    myPost: jest.fn().mockReturnValue({
        ok: true,
        data: {
            totalPages: 1,
            totalItems: 2,
            limit: 3,
            currentPageItems: 2,
            currentPage: 1,
            posts: [postStub],
        }
    }),
    publish: jest.fn().mockReturnValue({ ok: true }),
    categoryList: jest.fn().mockReturnValue({ ok: true, categories: [categoryStub] }),
    postsByCategory: jest.fn().mockReturnValue({
        ok: true,
        data: {
            totalPages: 1,
            totalItems: 2,
            limit: 3,
            currentPageItems: 2,
            currentPage: 1,
            posts: [postStub],
        }
    }),
    postByUser: jest.fn().mockReturnValue({
        ok: true,
        data: {
            totalPages: 1,
            totalItems: 2,
            limit: 3,
            currentPageItems: 2,
            currentPage: 1,
            posts: [postStub],
        }
    }),

    findOne: jest.fn().mockReturnValue({
        ok: true,
        post: postStub,
    }),

    update: jest.fn().mockReturnValue({ ok: true }),
    remove: jest.fn().mockReturnValue({ ok: true }),
})
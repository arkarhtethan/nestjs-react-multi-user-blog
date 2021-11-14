import { Comment } from "src/comment/entities/comment.entity";
import { postStub } from "src/post/test/stub/post.stub";
import { getUserStub } from "src/user/test/stubs/user.stub";

export const commentStub: Comment = {
    id: 1,
    post: postStub,
    user: getUserStub(),
    text: "asdfsdf",
    children: [],
    parent: null,
} as Comment;
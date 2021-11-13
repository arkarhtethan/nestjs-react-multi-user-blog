import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { getUserStub } from "src/user/test/stubs/user.stub";
import { categoryStub } from "./category.stub";

export const postStub: Post = {
    user: getUserStub() as User,
    category: categoryStub,
    id: 1,
} as Post;
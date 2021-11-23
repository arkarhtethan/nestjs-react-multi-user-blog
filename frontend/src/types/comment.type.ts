import { IPost } from "./post.type";
import { IUser } from "./user.type";

export interface IComment {
    id: number;
    text: string;
    post: IPost;
    createdAt: string;
    user: IUser;
}


export interface ICommentBody {
    text: string;
    postId: number;
}

export interface IPaginationInput {
    pageNumber?: number;
    limit?: number;
}

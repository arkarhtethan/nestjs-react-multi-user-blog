import { IComment } from "./comment.type";
export interface IPostUpdateBody {
    title?: string;
    content?: string;
    image?: string;
    published?: string;
    summary?: string;
    category?: string;
}

export interface IPostCreateBody {
    title: string;
    content: string;
    image: string;
    published: boolean;
    summary: string;
    category: string;
}

export interface IPostListInput {
    pageNumber?: number;
    limit?: number;
}

export interface IPost {
    id: number;
    published?: boolean;
    title: string;
    summary: string;
    image: string;
    content: string;
    slug: string;
    user: any;
    category: any;
    createdAt: Date;
    comments: IComment[];
}
export interface ICategory {
    id: number;
    name: string;
    slug: string;
}
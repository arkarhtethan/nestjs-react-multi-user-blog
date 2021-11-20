import axios from "../api/axios";
import { IPostCreateBody, IPostListInput, IPostUpdateBody } from "../types/post.type";
const PREFIX = 'post';

export function getPostsService ({ pageNumber = 1 }: IPostListInput) {
    return axios.get(`/${PREFIX}/?pageNumber=${pageNumber}`).then(res => res.data);
}

export function postsByIdService (postId: string | undefined) {
    return axios.get(`/${PREFIX}/${postId}`).then(res => res.data);
}

export function myPostsService ({ pageNumber = 1 }: IPostListInput) {
    return axios.get(`/${PREFIX}/mypost`).then(res => res.data);
}

export function categoryListService () {
    return axios.get(`/${PREFIX}/category/list`).then(res => res.data);
}

export function postByCategoryService (slug: string | undefined, { pageNumber = 1 }: IPostListInput) {
    return axios.get(`/${PREFIX}/category/${slug}?pageNumber=${pageNumber}`).then(res => res.data);
}

export function postByUserService (username: string | undefined, { pageNumber = 1 }: IPostListInput) {
    return axios.get(`/${PREFIX}/user/${username}?pageNumber=${pageNumber}`).then(res => res.data);
}

export function createPostService (data: IPostCreateBody) {
    return axios.post(`/${PREFIX}/`, data).then(res => res.data);
}

export function publishPostService (postId: string) {
    return axios.patch(`/${PREFIX}/publish/${postId}`).then(res => res.data);
}

export function updatePostService (postId: string, data: IPostUpdateBody) {
    return axios.patch(`/${PREFIX}/category/${postId}`, data).then(res => res.data);
}

export function deletePostService (postId: string) {
    return axios.delete(`/${PREFIX}/${postId}`).then(res => res.data);
}

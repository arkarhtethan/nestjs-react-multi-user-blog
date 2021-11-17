import axios from "../api/axios";
import { IPostCreateBody, IPostListInput, IPostUpdateBody } from "../types/post.type";
const PREFIX = 'post';

export function getPosts ({ pageNumber = 1 }: IPostListInput) {
    return axios.get(`/${PREFIX}/?pageNumber=${pageNumber}`).then(res => res.data);
}

export function postsById (postId: string | undefined) {
    return axios.get(`/${PREFIX}/${postId}`).then(res => res.data);
}

export function myposts () {
    return axios.get(`/${PREFIX}/mypost`).then(res => res.data);
}

export function categoryList () {
    return axios.get(`/${PREFIX}/category/list`).then(res => res.data);
}

export function postByCategory (slug: string | undefined, { pageNumber = 1 }: IPostListInput) {
    return axios.get(`/${PREFIX}/category/${slug}?pageNumber=${pageNumber}`).then(res => res.data);
}

export function postByUser (username: string | undefined, { pageNumber = 1 }: IPostListInput) {
    return axios.get(`/${PREFIX}/user/${username}?pageNumber=${pageNumber}`).then(res => res.data);
}

export function createPost (data: IPostCreateBody) {
    return axios.post(`/${PREFIX}/`, data).then(res => res.data);
}

export function publishPost (postId: string) {
    return axios.patch(`/${PREFIX}/publish/${postId}`).then(res => res.data);
}

export function updatePost (postId: string, data: IPostUpdateBody) {
    return axios.patch(`/${PREFIX}/category/${postId}`, data).then(res => res.data);
}

export function deletePost (postId: string) {
    return axios.delete(`/${PREFIX}/${postId}`).then(res => res.data);
}

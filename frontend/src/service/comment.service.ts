import axios from "../api/axios";
import { ICommentBody } from "../types/comment.type";
const PREFIX = 'comment';

export function createCommentService ({ postId, text }: ICommentBody) {
    return axios.post(`/${PREFIX}/`, { postId, text }).then(res => res.data);
}

export function getCommentsByPostIdService (postId: number) {
    return axios.get(`/${PREFIX}/post/${postId}`).then(res => res.data);
}

export function deleteCommentsByIdService (commentId: number) {
    return axios.delete(`/${PREFIX}/${commentId}`).then(res => res.data);
}

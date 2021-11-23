import { faCalendar, faFolderOpen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { Categories } from "../../components/post";
import { postsByIdService } from "../../service/post.service";
import LoadingCmp from "../../shared/loader/LoadingCmp";
import NotFound from "../../shared/NotFound";
import { IPost } from "../../types/post.type";
import renderHTML from 'react-render-html';
import CommentForm from "../../components/comment/CommentForm";
import Comments from "../../components/comment/Comments";
import { IComment } from "../../types/comment.type";
import { getCommentsByPostIdService } from "../../service/comment.service";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function PostDetail () {
    const { id } = useParams();
    const [post, setPost] = useState<IPost>();
    const [comments, setComments] = useState<IComment[]>([]);

    const user = useSelector((state: RootState) => state.auth.user)

    const { isLoading, isError } = useQuery(['posts-details', id], () => postsByIdService(id), {
        refetchOnWindowFocus: false,
        onSuccess: (response) => {
            if (response.ok) {
                setPost(response.post)
            }
        }
    })

    useQuery(['comments', id], () => getCommentsByPostIdService(id ? +id : 1), {
        refetchOnWindowFocus: false,
        onSuccess: (response) => {
            if (response.ok) {
                setComments(response.comments)
            }
        }
    })

    const deleteCallback = (deletedId: number) => {
        let modifiedComment = comments.filter(comment => comment.id !== deletedId);
        setComments([...modifiedComment])
    }

    const afterCreateCallback = (content: string) => {
        if (user && post) {
            const comment: IComment = {
                text: content,
                user,
                post,
                id: Date.now(),
                createdAt: Date.now().toString(),
            }
            setComments([comment, ...comments,])
        }
    }

    if (isLoading) {
        return <LoadingCmp />
    }

    if (!post) {
        return <NotFound title="Oops! We can't find that page." message="Why not check out other posts from given categories ?" />;
    }

    if (isError) {
        return <NotFound title="Oops! Something went wrong." message="Sorry!! Can't get post data at the moment." />
    }

    return (
        <div className="flex lg:flex-row flex-col lg:w-3/4 w-full lg:mx-auto mx-2 space-x-2 my-12">
            <div className="lg:w-3/4 w-full">
                <div className="px-4 bg-white shadow-lg text-justify pt-4 pb-10">
                    <h3 className="font-bold text-xl my-3">
                        {post.title}
                    </h3>
                    <div className="bg-red-300" style={{ height: "300px" }}>
                    </div>
                    <div className="flex my-3 space-x-4">
                        <div className="space-x-2 font-bold text-sm flex">
                            <FontAwesomeIcon icon={faUser} /> <p><Link to={`/user/${post.user.username}`}>{post.user.name}</Link></p>
                        </div>
                        <div className="space-x-2 font-bold text-sm flex">
                            <FontAwesomeIcon icon={faCalendar} /> <p>{format(post.createdAt)}</p>
                        </div>
                        <div className="space-x-2 font-bold text-sm flex">
                            <FontAwesomeIcon icon={faFolderOpen} /> <p><Link to={`/category/${post.category.slug}`}>{post.category.name}</Link></p>
                        </div>
                    </div>
                    <div>
                        {renderHTML(post.content)}
                    </div>
                </div>
                <div className="mt-4 lg:mb-0 mb-2">
                    {user && <CommentForm postId={post.id} callback={afterCreateCallback} />}
                    <Comments comments={comments} onDelete={deleteCallback} />
                </div>
            </div>
            <div className="lg:w-1/4 w-full">
                <Categories />
            </div>
        </div>
    )
}

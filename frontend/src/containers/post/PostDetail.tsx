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

export default function PostDetail () {
    const { id } = useParams();
    const [post, setPost] = useState<IPost>();

    const { isLoading, isError } = useQuery(['posts-details', id], () => postsByIdService(id), {
        refetchOnWindowFocus: false,
        onSuccess: (response) => {
            if (response.ok) {
                setPost(response.post)
            }
        }
    })


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
        <div className="flex w-3/4 mx-auto space-x-2 my-12">
            <div className="w-3/4 px-4 bg-white shadow-lg text-justify pb-10">
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
            <div className="w-1/4">
                <Categories />
            </div>
        </div>
    )
}

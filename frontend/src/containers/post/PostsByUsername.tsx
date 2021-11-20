import { useState } from "react";
import { useQuery } from "react-query"
import PostList from "../../components/post/PostList";
import { postByUserService } from "../../service/post.service";
import { IPost } from "../../types/post.type";
import { useParams } from "react-router";
import { IUser } from "../../types/user.type";
import { SEOHeader } from "../../components/header";

export default function PostsByUsername () {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [postPerPage, setPostPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [user, setUser] = useState<IUser>();
    const { slug: username } = useParams();

    const { isError, isLoading } = useQuery(['posts-user', username, pageNumber], () => postByUserService(username, { pageNumber }), {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        onSuccess: (response) => {
            if (response.ok) {
                console.log(response.data)
                setPageNumber(response.data.currentPage)
                setPostPerPage(response.data.limit)
                setTotalItems(response.data.totalItems)
                setPosts(response.data.posts)
                setUser(response.data.user)
            }
        }
    })

    return (
        <>
            <SEOHeader title={`${user?.name}`} description={`Posts by ${user?.name}`} />
            <PostList totalItems={totalItems} isLoading={isLoading} isError={isError} pageNumber={pageNumber} setPageNumber={setPageNumber} postPerPage={postPerPage} posts={posts} user={user} />
        </>
    )
}

import { useState } from "react";
import { useQuery } from "react-query";
import { SEOHeader } from "../../components/header";
import PostList from "../../components/post/PostList";
import { getPostsService } from "../../service/post.service";
import { IPost } from "../../types/post.type";

export default function Posts () {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [postPerPage, setPostPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState<number>(0);

    const { isError, isLoading } = useQuery(['posts', pageNumber], () => getPostsService({ pageNumber }), {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        onSuccess: (response: any) => {
            if (response?.ok) {
                setPageNumber(response?.data.currentPage)
                setPostPerPage(response?.data.limit)
                setTotalItems(response?.data.totalItems)
                setPosts(response?.data.posts)
            }
        }
    })
    return (
        <>
            <SEOHeader title="Post List" description={"Explore Posts at km blog."} />
            <PostList totalItems={totalItems} isLoading={isLoading} isError={isError} pageNumber={pageNumber} setPageNumber={setPageNumber} postPerPage={postPerPage} posts={posts} />
        </>
    )
}

import { useState } from "react";
import { useQuery } from "react-query"
import PostList from "../../components/post/postList";
import { postByCategory } from "../../service/post.service";
import { ICategory, IPost } from "../../types/post.type";
import { useParams } from "react-router";
import { SEOHeader } from "../../components/header";

export default function PostsByCategory () {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [postPerPage, setPostPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const { slug: categoryName } = useParams();
    const [category, setCategory] = useState<ICategory>();

    const { isError, isLoading } = useQuery(['posts-category', categoryName, pageNumber], () => postByCategory(categoryName, { pageNumber }), {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        onSuccess: (response) => {
            if (response.ok) {
                console.log(response.data)
                setPageNumber(response.data.currentPage)
                setPostPerPage(response.data.limit)
                setTotalItems(response.data.totalItems)
                setPosts(response.data.posts)
                setCategory(response.data.category)
            }
        }
    })

    return (
        <>
            <SEOHeader title={`${category?.name}`} description={`Posts for ${category?.name}`} />
            <PostList totalItems={totalItems} isLoading={isLoading} isError={isError} pageNumber={pageNumber} setPageNumber={setPageNumber} postPerPage={postPerPage} posts={posts} category={category} />
        </>
    )
}

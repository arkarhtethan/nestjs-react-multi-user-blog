import { useState } from "react";
import { useQuery } from "react-query"
import Categories from "../../components/post/categories";
import PostList from "../../components/post/postList";
import { postByCategory } from "../../service/post.service";
import { ErrorMessage } from "../../shared/error/formError";
import { Spinner } from "../../shared/loader"
import { ICategory, IPost } from "../../types/post.type";
import Pagination from 'react-js-pagination'
import { useParams } from "react-router";

export default function PostsByCategory () {
    const [posts, setPosts] = useState<IPost[]>();
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

    const handleChange = (data: any) => {
        console.log(data);
        setPageNumber(data)
    }

    const buidLoading = () => {
        return <div className="w-full flex items-center justify-center py-44">
            <Spinner color={"#000"} height={40} />
        </div>
    }

    const buidError = () => {
        return <div className="w-full flex items-center justify-center py-44">
            <ErrorMessage message="Something went wrong." classes="text-xl" />
        </div>
    }

    const buildPosts = () => {
        return <>
            {posts && <PostList posts={posts} />}
            {posts && <div className="lg:my-24 my-12">
                <Pagination
                    innerClass="flex pl-0 rounded list-none flex-wrap justify-center"
                    itemClass="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-gray-500 bg-white text-gray-500"
                    activePage={pageNumber}
                    activeLinkClass="bg-black text-white w-full rounded-full h-full pt-2 pl-3"
                    itemsCountPerPage={postPerPage}
                    totalItemsCount={totalItems}
                    onChange={handleChange}
                    disabledClass="bg-gray-400 text-gray-100"
                />

            </div>}
        </>
    }

    const buildEmptyPosts = () => {
        return <div className="my-24 text-2xl text-center">
            Post not found for <strong>{category?.name}</strong>
        </div>
    }

    if (isLoading) {
        return buidLoading();
    }

    if (isError) {
        return buidError()
    }

    return (
        <>
            <div className="w-4/5 space-x-3 mx-auto flex mt-4">
                <div className="w-3/4">
                    <p className="my-8 text-2xl">Posts by <span className="font-bold">{category?.name}</span></p>
                    {posts && posts.length > 0 ? buildPosts() : buildEmptyPosts()}
                </div>
                <div className="w-1/4">
                    <Categories />
                </div>
            </div>
        </>
    )
}

import Pagination from "react-js-pagination";
import { ErrorMessage } from "../../shared/error/FormError";
import { Spinner } from "../../shared/loader";
import { ICategory, IPost } from "../../types/post.type";
import { IUser } from "../../types/user.type";
import Categories from "./Categories";
import PostItem from "./PostItem";

interface IPostListProps {
    setPageNumber: (val: number) => void;
    posts: IPost[];
    isLoading: boolean;
    isError: boolean;
    pageNumber: number;
    postPerPage: number;
    totalItems: number;
    category?: ICategory;
    user?: IUser;
}

export default function PostList ({
    posts,
    setPageNumber,
    isLoading,
    isError,
    pageNumber,
    postPerPage,
    totalItems, }: IPostListProps) {


    const handleChange = (data: any) => {
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

    const buildPostList = () => {
        return <div className="space-y-4">
            {posts?.map(post => <PostItem key={post.id} post={post} />)}
        </div>
    }

    if (isLoading) {
        return buidLoading();
    }

    if (isError) {
        return buidError()
    }


    return (
        <div className="lg:w-4/5 space-x-3 mx-auto flex lg:flex-row flex-col mt-4">
            <div className="lg:w-3/4 lg:mx-0 mx-3">
                {posts && buildPostList()}
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
            </div>
            <div className="lg:w-1/4 lg:mb-0 mb-12">
                <Categories />
            </div>
        </div>
    )
}

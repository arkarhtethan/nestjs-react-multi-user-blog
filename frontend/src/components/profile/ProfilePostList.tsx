import { faCheckCircle, faCheckDouble, faPencilAlt, faPlusCircle, faTimesCircle, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Pagination from "react-js-pagination";
import { useMutation, useQuery } from "react-query"
import { Link } from "react-router-dom";
import { deletePostService, myPostsService, publishPostService } from "../../service/post.service";
import FormError, { ErrorMessage } from "../../shared/error/FormError";
import { Spinner } from "../../shared/loader";
import { IPost } from "../../types/post.type";
import { SEOHeader } from "../header";

export default function ProfilePostList () {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [postPerPage, setPostPerPage] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [errorMessage, setErrorMessage] = useState();
    let id2Delete: number;
    let id2Publish: number;

    const { isError, isLoading } = useQuery(['my-posts', pageNumber], () => myPostsService({ pageNumber }), {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        onSuccess: (response) => {
            if (response.ok) {
                setPageNumber(response.data.currentPage)
                setPosts(response.data.posts)
                setPostPerPage(response.data.limit)
                setTotalItems(response.data.totalItems)
            }
        }
    })

    const { mutate: publishMutate, isLoading: publishLoading } = useMutation(() => publishPostService(id2Publish), {
        onSuccess: (data) => {
            if (data.ok) {
                const tempPosts: IPost[] = JSON.parse(JSON.stringify(posts));
                const post = tempPosts.find(post => post.id === id2Publish);
                const index = posts.findIndex(post => post.id === id2Publish);
                if (!post || index < 0) {
                    return;
                }
                tempPosts[index].published = true;
                setPosts(tempPosts);
            }
        },
        onError: (data: any) => {
            setErrorMessage(data.response.data.message);
        },
    })

    const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(() => deletePostService(id2Delete), {
        onSuccess: (data) => {
            if (data.ok) {
                const index = posts.findIndex(post => post.id === id2Delete);
                const tempPosts = JSON.parse(JSON.stringify(posts));
                if (index > -1) {
                    tempPosts.splice(index, 1);
                }
                setPosts(tempPosts);
            }
        },
        onError: (data: any) => {
            setErrorMessage(data.response.data.message);
        },
    })

    const deletePost = (id: number) => {
        id2Delete = id;
        deleteMutate();
    }

    const publishPost = (id: number) => {
        id2Publish = id;
        publishMutate();
    }

    const handleChange = (data: number) => {
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

    if (isLoading) {
        return buidLoading();
    }

    if (isError) {
        return buidError()
    }
    const buildPosts = (postItems: IPost[]) => {
        return postItems.map(post => {
            return (<tr className="text-center border-b-2" key={post.id}>
                <td className="py-2">{post.id}</td>
                <td>
                    <Link to="/">
                        {post.title}
                    </Link>
                </td>
                <td>{post.category.name}</td>
                <td className="text-xs">{post.summary.substring(0, 20)} ...</td>
                <td>{post.published === true ? <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> : <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />}</td>
                <td className="space-x-4 text-sm">
                    {post.published === false && <span title="Publish Post" style={publishLoading ? { width: 50 } : {}}>
                        {(publishLoading && id2Publish === post.id) ? <Spinner color="#000" height={12} /> :
                            <FontAwesomeIcon icon={faCheckDouble} onClick={() => publishPost(post.id)} className="cursor-pointer" />}
                    </span>}
                    <span title="Delete Post" style={deleteLoading ? { width: 50 } : {}}>
                        {(deleteLoading && id2Delete === post.id) ? <Spinner color="#000" height={12} /> :
                            <FontAwesomeIcon icon={faTrashAlt} onClick={() => deletePost(post.id)} className="cursor-pointer" />}
                    </span>
                    <button title="Update Post">
                        <Link to={`/profile/post/${post.id}`}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </Link>
                    </button>
                </td>
            </tr>)
        })

    }

    return (
        <div id="accountPanel" className="px-10 py-5">
            <SEOHeader title="Your Posts" description="List of posts created by you." />
            <div className="flex justify-between items-center">
                <h3 className="text-2xl mb-4 font-bold">Your Posts</h3>
                <Link to="/profile/post" className="ml-3">
                    <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />
                </Link>
            </div>
            <hr className="border-black" />
            {errorMessage && <div className="my-2">
                <FormError onClick={() => setErrorMessage(undefined)} message="Something went wrong" />
            </div>}
            <table className="table-auto w-full">
                <thead className="bg-green-500">
                    <tr className="w-full bg-black text-white">
                        <th className="py-2">No</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Content</th>
                        <th>Published</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {buildPosts(posts)}
                </tbody>
            </table>
            <div className="my-12">
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
            </div>
        </div>
    )
}

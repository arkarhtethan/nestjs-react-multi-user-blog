import { IPostListProps } from "../../types/component.type";
import PostItem from "./postItem";

export default function PostList ({ posts }: IPostListProps) {
    return (
        <div className="space-y-2">
            {posts?.map(post => <PostItem post={post} />)}
        </div>
    )
}

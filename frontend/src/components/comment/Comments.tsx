import { IComment } from "../../types/comment.type";
import CommentItem from "./CommentItem";

interface ICommentsProps {
    comments: IComment[];
    onDelete: (id: number) => void;
}

export default function Comments ({ comments, onDelete }: ICommentsProps) {
    return (
        <div className="space-y-4">
            {comments.map(comment => <CommentItem key={comment.id} comment={comment} onDelete={onDelete} />)}
        </div>
    )
}

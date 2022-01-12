import { faTrashAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import { IComment } from "../../types/comment.type";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { deleteCommentsByIdService } from "../../service/comment.service";
import { useMutation } from "react-query";

interface ICommentItemProps {
    comment: IComment;
    onDelete: (id: number) => void;
}

export default function CommentItem ({ comment, onDelete }: ICommentItemProps) {
    const text = comment.text;
    const [displayComment, setDisplayComment] = useState('');
    const [showMore, setShowMore] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user);

    const expandText = () => {
        if (!(text.length > 280)) {
            setDisplayComment(text);
            return;
        }
        if (!showMore) {
            setDisplayComment(text.substring(0, 280) + (text.length > 280 ? "..." : ""))
            setShowMore(true)
            return;
        } else {
            setDisplayComment(text);
            setShowMore(false)
        }
    }

    useEffect(() => {
        if (showMore) {
            setDisplayComment(text.substring(0, 280) + (text.length > 280 ? "..." : ""))
        }
    }, [showMore, text])

    const { isLoading, mutate } = useMutation(() => deleteCommentsByIdService(comment.id), {
        onSuccess: (response) => {
            if (response.ok) {
                onDelete(comment.id);
            }
        }
    },
    );

    const deleteCommentHandler = (event: any) => {
        event.preventDefault();
        if (!isLoading) {
            mutate();
        }
    }

    return (
        <div className="shadow-xl py-4 bg-white px-2 flex items-center pl-4 space-x-4 w-full">
            <FontAwesomeIcon icon={faUserCircle} size={'2x'} />
            <div className="flex flex-col w-11/12">
                <div className="flex items-center justify-between">
                    <p className="text-lg">
                        {comment.user.name}
                    </p>
                    <div className="flex items-center space-x-2">
                        {(user && user.id === comment.user.id) && <FontAwesomeIcon icon={faTrashAlt} className="text-xs cursor-pointer" onClick={deleteCommentHandler} />}
                        <p className="text-sm text-gray-500 font-bold">({format(comment.createdAt)})</p>
                    </div>
                </div>
                <p className="text-sm w-full" style={{ wordWrap: "break-word" }}>
                    {displayComment} {text.length > 280 && <p onClick={expandText} className="underline cursor-pointer">Show {showMore ? "More" : "Less"}</p>}
                </p>
            </div>
        </div >
    )
}

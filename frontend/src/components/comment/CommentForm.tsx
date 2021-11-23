import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { createCommentService } from "../../service/comment.service";
import { SubmitButton } from "../../shared/button";
import { getErrorMessage } from "../../utils/getErrorMessage";
interface ICommentFormProps {
    postId: number;
    callback: (content: string) => void;
}

export default function CommentForm ({ postId, callback }: ICommentFormProps) {

    const [errorMessage, setErrorMessage] = useState(null);

    const { register, watch, handleSubmit, reset } = useForm({ mode: 'onChange' });

    const { content } = watch();

    const { mutate, isLoading } = useMutation((text: string) => createCommentService({ postId, text }), {
        onSuccess: (response: any) => {
            if (response.ok) {
                callback(content);
                reset();
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error))
        }
    });

    const isValid = () => {
        return content && content.length > 0;
    }

    const submitHandler = () => {
        mutate(content);
    }

    return (
        <div className="flex items-center justify-center shadow-lg mb-4">
            <form className="w-full bg-white px-4" onSubmit={handleSubmit(submitHandler)}>
                <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-full px-3 mb-2 mt-2">
                        <textarea
                            {...register('content', {
                                required: "This field is required."
                            })}
                            className="bg-gray-100 border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                            placeholder='Type Your Comment'
                        />
                    </div>
                    <div className="px-3">
                        <SubmitButton loading={isLoading} isValid={isValid()} buttonText="Post Comment" classes="px-4" />
                    </div>
                </div>
            </form>
        </div>
    )
}

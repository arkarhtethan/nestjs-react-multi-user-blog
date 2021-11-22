import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { SubmitButton } from "../../shared/button";
import { ErrorMessage } from "../../shared/error/FormError";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { SEOHeader } from "../header";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { createPostService } from "../../service/post.service";
import Message from "../../shared/Message";

export default function PostForm () {

    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<any>();

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        mode: "onChange",
    });

    const { title, category, summary, published, image } = watch();

    const { mutate } = useMutation(createPostService, {
        onSuccess: (response) => {
            reset();
            setLoading(false);
            setContent(null);
            setErrorMessage(null);
            setSuccessMessage("Successfully created new post.")
        },
        onError: (error) => {
            setLoading(false);
            setErrorMessage(getErrorMessage(error))
        }
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const isValid = () => {
        if (content &&
            (title && title.length > 0) &&
            (category && category.length > 0) &&
            (image && image.length > 0) &&
            (summary && summary.length > 0)
        ) {
            return draftToHtml(content).length > 8
        }
        return false;

    }

    const onSubmit = () => {
        setLoading(true);
        mutate({
            category,
            content: draftToHtml(content),
            image,
            published,
            summary,
            title,
        })
    }

    return (
        <div id="accountPanel" className="px-10 pt-5 text-gray-900">
            <SEOHeader title="Edit Profile" description="Edit your profile." />
            <h3 className="text-2xl mb-4 font-bold">Create New Post</h3>
            <hr className="border-black" />
            <div className="mt-6">
                {errorMessage && <div className="mb-2"><Message variant="red" message={errorMessage} onClick={() => setErrorMessage(null)} /></div>}
                {successMessage && <div className="mb-2"><Message variant="green" message={successMessage} onClick={() => setSuccessMessage(null)} /></div>}
                <form action="" className="flex flex-col pb-8 space-y-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex space-x-3 ">
                        <div className="w-1/2">
                            <input
                                {...register("title", {
                                    required: "This field is required."
                                })}
                                type="text"
                                placeholder="Post Title"
                                className="border-2 border-black p-2 w-full"
                            />
                            {errors.title && errors.title.message && <ErrorMessage message={errors.title.message} />}
                        </div>
                        <div className="w-1/2">
                            <input
                                {...register("category", {
                                    required: "This field is required."
                                })}
                                type="text"
                                placeholder="Category Name"
                                className="border-2 border-black p-2 w-full"
                            />
                            {errors.category && errors.category.message && <ErrorMessage message={errors.category.message} />}
                        </div>
                    </div>
                    <div className="w-1/2">
                        <input
                            {...register("image", {
                                required: "This field is required."
                            })}
                            type="text"
                            placeholder="Image Url"
                            className="border-2 border-black p-2 w-full"
                        />
                        {errors.image && errors.image.message && <ErrorMessage message={errors.image.message} />}
                    </div>
                    <div className="">
                        <textarea
                            rows={4}
                            {...register("summary", {
                                required: "This field is required.",
                            })}
                            placeholder="Post Summary"
                            className="border-2 border-black p-2 w-full"
                        />
                        {errors.summary && errors.summary.message && <ErrorMessage message={errors.summary.message} />}
                    </div>
                    <div className="border-2    ">
                        <Editor
                            toolbar={{
                                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'history'],
                            }}
                            editorClassName="h-64"
                            onChange={data => setContent(data)}
                        />

                    </div>
                    <div>
                        <label className="inline-flex items-center">
                            <input
                                {...register("published")}
                                type="checkbox"
                                defaultChecked={true}
                            />
                            <span className="ml-2 mt-1 text-gray-700">Publish</span>
                        </label>

                    </div>
                    <SubmitButton loading={loading} buttonText="Create Post" isValid={isValid()} />
                </form>
            </div>
        </div>

    );
}

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { SubmitButton } from "../../shared/button";
import { ErrorMessage } from "../../shared/error/FormError";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { SEOHeader } from "../header";
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { createPostService, postsByIdService, updatePostService } from "../../service/post.service";
import Message from "../../shared/Message";
import { useNavigate, useParams } from "react-router";
import { IPost, IPostUpdateBody } from "../../types/post.type";
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { stateToHTML } from "draft-js-export-html";

export default function PostForm () {

    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<any>();
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [post, setPost] = useState<IPost>();
    const [isEditing, setisEditing] = useState(false);
    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        setisEditing(id !== undefined)
    }, [id])

    const { register, handleSubmit, watch, reset, formState: { errors }, setValue } = useForm({
        mode: "onChange",
    });

    const { title, category, summary, published, image } = watch();

    useQuery(['posts-details', id], () => postsByIdService(id), {
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: isEditing,
        onSuccess: (response) => {
            if (response.ok) {
                const post: IPost = response.post;
                setValue("title", post.title)
                setValue("summary", post.summary)
                setValue("image", post.image)
                setValue("published", post.published)
                setValue("category", post.category.name)
                setContent(post.content);
                setPost(post);
                const blocksFromHtml = htmlToDraft(post.content);
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                setEditorState(EditorState.createWithContent(contentState));
            }
        },
        onError: (err: any) => {
            navigate('/profile/post')
        }
    })

    const { mutate: createPostMutate } = useMutation(createPostService, {
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

    const { mutate: updatePostMutate } = useMutation((postData: IPostUpdateBody) => updatePostService(id || "", postData), {
        onSuccess: (response) => {
            navigate('/profile/posts')
        },
        onError: (error: any) => {
            setLoading(false);
            setErrorMessage(getErrorMessage(error))
        }
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const sameWithPrevState = () => {
        return (title === post?.title) &&
            (summary === post?.summary) &&
            (category === post?.category.name) &&
            (image === post?.image) &&
            (published === post?.published) &&
            (post?.content === stateToHTML(editorState.getCurrentContent()));

    }

    const isValid = () => {
        const editorContent = stateToHTML(editorState.getCurrentContent())
        const isValidEditorContent = (editorContent.length > 7 && !editorContent.includes('<br>'))

        const validationResult = (isValidEditorContent &&
            (title && title.length > 0) &&
            (category && category.length > 0) &&
            (image && image.length > 0) &&
            (summary && summary.length > 0)
        )
        if (isEditing) {
            return validationResult && !sameWithPrevState();
        }
        return validationResult;
    }

    const onSubmit = () => {
        setLoading(true);
        if (isEditing && post) {
            const editorContent = stateToHTML(editorState.getCurrentContent());
            const updateObj: IPostUpdateBody = ({
                ...(title !== post?.title && { title }),
                ...(summary !== post?.summary && { summary }),
                ...((category !== post?.category.name) && ({ category })),
                ...((image !== post?.image) && ({ image })),
                ...((published !== post?.published) && ({ published })),
                ...((post?.content !== editorContent)) && ({ content: editorContent })
            });
            updatePostMutate(updateObj)
        } else {
            createPostMutate({
                category,
                content: stateToHTML(editorState.getCurrentContent()),
                image,
                published,
                summary,
                title,
            })
        }
    }

    return (
        <div id="accountPanel" className="lg:px-10 px-3 pt-5 text-gray-900">
            <SEOHeader title="Edit Profile" description="Edit your profile." />
            <h3 className="text-2xl mb-4 font-bold">{isEditing ? "Update" : "Create New"} Post</h3>
            <hr className="border-black" />
            <div className="mt-6">
                {errorMessage && <div className="mb-2"><Message variant="red" message={errorMessage} onClick={() => setErrorMessage(null)} /></div>}
                {successMessage && <div className="mb-2"><Message variant="green" message={successMessage} onClick={() => setSuccessMessage(null)} /></div>}
                <form action="" className="flex flex-col pb-8 space-y-2 " onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex lg:flex-row flex-col lg:space-x-3 lg:space-y-0 space-y-2 ">
                        <div className="lg:w-1/2">
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
                        <div className="lg:w-1/2">
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
                    <div className="lg:w-1/2">
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
                    <div className="border-2">
                        <Editor
                            toolbar={{
                                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'history'],
                            }}
                            onEditorStateChange={(data) => {
                                setEditorState(data)
                            }}
                            editorState={editorState}
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
                    <SubmitButton loading={loading} buttonText={isEditing ? `Update` : `Create`} isValid={isValid()} />
                </form>
            </div>
        </div>

    );
}

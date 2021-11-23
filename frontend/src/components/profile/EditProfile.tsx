import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { myProfileService, updateProfileService } from "../../service/auth.service";
import { getToken } from "../../service/localstorage.service";
import { SubmitButton } from "../../shared/button";
import FormError, { ErrorMessage } from "../../shared/error/FormError";
import { RootState } from "../../store";
import { login } from "../../store/auth.slice";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { SEOHeader } from "../header";

export default function EditProfile () {

    const dispatch = useDispatch();

    const [enabled, setEnabled] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const token = getToken();

    useQuery(`profile-${token}`, myProfileService, {
        enabled: enabled,
        retryOnMount: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 2,
        onSuccess: (data: any) => {
            if (data.ok) {
                dispatch(login(data.user));
            }
            setLoading(false);
        },
        onError: () => {
            setLoading(false);
        }
    });

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            name: user ? user.name : "",
            email: user ? user.email : "",
            bio: user ? user.bio : "",
        }
    });

    const { mutate } = useMutation(updateProfileService, {
        onSuccess: (response) => {
            if (response.ok) {
                setEnabled(true);
            }
        },
        onError: (error) => {
            setLoading(false);
            setErrorMessage(getErrorMessage(error))
        }
    });

    const [errorMessage, setErrorMessage] = useState(null);

    const { name, email, bio } = watch();

    const isSameWithPrevValue = () => {
        if (user) {
            return bio === user.bio &&
                email === user.email &&
                name === user.name;
        }
        return true;
    }

    const isValid = () => {
        const passwordList: string[] = [name, email, bio];
        const isNotEmpty = passwordList.every(pword => pword && pword.trim().length >= 6)
        return isNotEmpty && isChanged && !isSameWithPrevValue();
    }

    const onSubmit = () => {
        setLoading(true);
        const updateObj = {
            ...((bio && user) && (bio !== user?.bio) && { bio }),
            ...((name && user) && (name !== user?.name) && { name }),
            ...((email && user) && (email !== user?.email) && { email })
        }
        mutate(updateObj)
    }

    return (
        <div id="accountPanel" className="px-10 pt-5 text-gray-900">
            <SEOHeader title="Edit Profile" description="Edit your profile." />
            <h3 className="text-2xl mb-4 font-bold">Edit Profile</h3>
            <hr className="border-black" />
            <p className="mb-3 mt-6 text-gray-500">
                Edit your profile details.
            </p>
            <div className="lg:w-1/3">
                <div className={`mb-2 ${errorMessage ? 'block' : 'hidden'} duration-300 transition-all`}>
                    {(errorMessage) && <FormError onClick={() => setErrorMessage(null)} message={errorMessage} />}
                </div>
                <form action="" className="flex flex-col pb-8" onSubmit={handleSubmit(onSubmit)} onChange={() => setIsChanged(true)}>
                    <input
                        {...register("name", {
                            minLength: {
                                value: 6,
                                message: "The name must be at least 6 characters long."
                            }, required: "This field is required."
                        })}
                        type="text"
                        placeholder="Your Name"
                        className="border-2 border-black p-2 md:mb-4 mb-2"
                    />
                    {errors.name && errors.name.message && <ErrorMessage message={errors.name.message} />}
                    <input
                        {...register("email", {
                            required: "This field is required.",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        type="email"
                        placeholder="Your Email"
                        className="border-2 border-black p-2 md:mb-4 mb-2"
                    />
                    {errors.email && errors.email.message && <ErrorMessage message={errors.email.message} />}
                    <textarea
                        {...register("bio", {
                            minLength: {
                                value: 6,
                                message: "The password must be at least 6 characters long."
                            }
                        })}
                        placeholder="Your Bio"
                        className="border-2 border-black p-2 md:mb-4 mb-2"
                    />
                    {errors.bio && errors.bio.message && <ErrorMessage message={errors.bio.message} />}
                    <SubmitButton loading={loading} buttonText="Edit Profile" isValid={isValid()} />
                </form>
            </div>
        </div>

    );
}

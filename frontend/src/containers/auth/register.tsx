import { useState } from 'react'
import { useForm } from "react-hook-form";
import { useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import FormError, { ErrorMessage } from '../../shared/error/formError';
import { SEOHeader } from '../../components/header';
import { SubmitButton } from '../../shared/button';
import { registerService } from '../../service/auth.service';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const Register = () => {
    const [errorMessage, setErrorMessage] = useState(null);

    const { register, getValues, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });
    const navigate = useNavigate();
    const { email, password, name } = getValues();
    const { mutate, isLoading } = useMutation(registerService, {
        onSuccess: ({ data }) => {
            if (data.ok) {
                navigate('/login')
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error))
        }
    })

    const onSubmit = () => {
        mutate({ email, password, name })
    }

    const isValid = () => {
        return (email && email.length !== 0)
            && (password && password.length !== 0)
            && (name && name.length !== 0)
            && Object.entries(errors).length === 0;
    }

    const handleChange = () => {
        setErrorMessage(null)
    }

    return (
        <div className="lg:pt-8 py-10">
            <SEOHeader title="Register" description="Create account at KM DAILY." />
            <form className="flex flex-col mx-auto w-3/4 md:w-1/2 lg:w-1/3 bg-white p-8 shadow-xl" onChange={handleChange} onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-2xl mb-4 font-bold">Create Your Account </h2>
                <div className="mb-2">
                    {(errorMessage) && <FormError message={errorMessage} onClick={() => setErrorMessage(null)} />}
                </div>
                <input
                    {...register("name", {
                        required: {
                            value: true,
                            message: "This field is required."
                        },
                        minLength: {
                            value: 5,
                            message: "Your name must be at least 5 characters."
                        }
                    })}
                    placeholder="Name"
                    className="border-2 border-black p-2 md:mb-4 mb-2"
                />
                {errors.name && <ErrorMessage message={errors.name.message} />}
                <input
                    {...register("email", {
                        required: {
                            value: true,
                            message: "This field is required."
                        },
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
                    })}
                    placeholder="Email Address"
                    type="email"
                    className="border-2 border-black p-2 md:mb-4 mb-2"
                />
                {errors.email && <ErrorMessage message={errors.email.message} />}
                <input
                    {...register("password", {
                        required: {
                            value: true,
                            message: "This field is required."
                        }, minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long."
                        }
                    })}
                    placeholder="Password"
                    type="password"
                    className="border-2 border-black p-2 md:mb-4 mb-2"
                />
                {errors.password && <ErrorMessage message={errors.password.message} />}
                <SubmitButton buttonText="REGISTER" loading={isLoading} isValid={isValid()} />
                <div className="flex text-gray-400">
                    <div className="h-4 border-gray-500 border-b-2 w-1/2"></div>
                    <span className="font-black mx-1 mt-1">OR</span>
                    <div className="h-4 border-gray-500 border-b-2 w-1/2"></div>
                </div>
                <Link to="/login" className="mt-4 text-center border-black border-2 text-black py-2 h-10"> LOGIN </Link>
            </form>
        </div>
    )
}

import { useState } from 'react'
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import FormError, { ErrorMessage } from '../../shared/error/FormError';
import { SubmitButton } from '../../shared/button';
import { useMutation } from 'react-query';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { SEOHeader } from '../../components/header';
import { loginService } from '../../service/auth.service';
import { saveToken } from '../../service/localstorage.service';
import { useDispatch } from 'react-redux';
import { login } from '../../store/auth.slice';

export const Login = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode: "onChange" });
    const { email, password } = getValues();
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState(null);
    const { isLoading, mutate } = useMutation(loginService, {
        onSuccess: ({ data }) => {
            if (data.ok) {
                saveToken(data.token)
                if (data.user) {
                    dispatch(login(data.user));
                }
                navigate('/')
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error))
        }
    });

    const onSubmit = () => {
        mutate({ email, password });
    }

    const isValid = () => {
        return (email && email.length !== 0) && (password && password.length !== 0) && Object.entries(errors).length === 0;
    }

    console.log(getValues());

    const handleChange = () => {
        setErrorMessage(null);
    }

    return (
        <div className="py-16" >
            <SEOHeader title="LOGIN" description="Log in to your km daily account." />
            <form className="flex flex-col mx-auto w-3/4 md:w-1/2 lg:w-1/3 bg-white shadow-lg p-8" onSubmit={handleSubmit(onSubmit)} onChange={handleChange}>
                <h2 className="text-2xl mb-4 font-bold">Log In To Your Account </h2>
                <div className={`mb-2 ${errorMessage ? 'block' : 'hidden'} duration-300 transition-all`}>
                    {(errorMessage) && <FormError onClick={() => setErrorMessage(null)} message={errorMessage} />}
                </div>
                <input
                    {...register("email", {
                        required: "Please enter an email address",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
                    })}
                    placeholder="user@example.com"
                    className="border-2 border-black p-2 md:mb-4 mb-2" />
                {errors.email && <ErrorMessage message={errors.email.message} />}
                <input
                    {...register("password", {
                        minLength: {
                            value: 6,
                            message: "The password must be at least 6 characters long."
                        }, required: "This field is required."
                    })}
                    type="password"
                    placeholder="*******"
                    className="border-2 border-black p-2 md:mb-4 mb-2"
                />
                {errors.password && <ErrorMessage message={errors.password.message} />}
                {/* use in nromal design */}
                <SubmitButton loading={isLoading} buttonText="Login" isValid={isValid()} />
                {/* when sending request */}
                <Link to="/register" className="text-center border-black border-2 text-black py-2"> REGISTER </Link>
            </form>
        </div>
    )
}

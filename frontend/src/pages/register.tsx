import { NavLink } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";

interface RegisterForm {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
}

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
    const onSubmit: SubmitHandler<RegisterForm> = (data) => {
        console.log(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 -mt-16">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-semibold text-center mb-6 text-accent">
                    Register
                </h1>
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-accent">
                            Firstname
                        </label>
                        <input
                            {...register("firstname", { required: "Firstname is required", maxLength: { value: 50, message: "Max length is 50" } })}
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-accent"
                        />
                        {errors.firstname && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.firstname.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-accent">
                            Lastname
                        </label>
                        <input
                            {...register("lastname", { required: "Lastname is required", maxLength: { value: 50, message: "Max length is 50" } })}
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-accent"
                        />
                        {errors.lastname && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.lastname.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-accent">
                            Email
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required", maxLength: { value: 50, message: "Max length is 50" }, pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                },
                            })}
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-accent"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required", minLength: { value: 5, message: "Min length is 5" } })}
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-accent"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition cursor-pointer"
                    >
                        Register
                    </button>
                    <NavLink to={"/Login"} className="text-center py-2 text-primary cursor-pointer">
                        Login instead
                    </NavLink>
                </form>

            </div>
        </div >
    );
}

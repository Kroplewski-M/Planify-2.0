import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

interface LoginFormInput {
  email: string;
  password: string;
}

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const { register, handleSubmit } = useForm<LoginFormInput>();
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated)
      navigate("/events");
  }, []);


  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    if (data.email === '' || data.password === '')
      return;
    axiosClient.post('/auth/login', data)
      .then((res) => {
        if (res.status === 200) {
          login(res.data.token);
          navigate("/events");
        }
        else {
          console.log(res.data.errors)
          setServerErrors([res.data.errors]);
        }
      })
      .catch(err => {
        const response = err.response.data;
        if (response?.errors) {
          const flattenedErrors = Object.values(response.errors).flat() as string[];
          setServerErrors(flattenedErrors);
        } else if (response?.error) {
          setServerErrors([response.error]);
        } else {
          setServerErrors(["Unexpected error occurred"]);
        }
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 -mt-16">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold text-center mb-6 text-accent">
          Login
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium mb-1 text-accent">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition cursor-pointer"
          >
            Login
          </button>
          {serverErrors.length > 0 && (
            <ul className="list-none">
              {serverErrors.map((err, i) => (
                <li key={i} className="text-red-500">{err}</li>
              ))}
            </ul>
          )}
          <NavLink
            to={"/register"}
            className="text-center py-2 text-primary cursor-pointer"
          >
            Register instead
          </NavLink>
        </form>
      </div>
    </div>
  );
}

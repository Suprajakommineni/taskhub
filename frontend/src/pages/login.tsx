import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as apiclient from "../apiclient";
import { toast } from "react-toastify";

export type loginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (formData: loginFormData) =>
      apiclient.loginUser(formData),

    onSuccess: (data) => {
      console.log("FULL DATA:", data);
      console.log("TOKEN:", data?.token);

      localStorage.setItem("token", data.token);

      console.log("STORED:", localStorage.getItem("token"));

      navigate("/projects");
    },

    onError: (error: any) => {
      toast.error(error.message || "Invalid credentials", {
        position: "top-center",
        autoClose: 2000,
      });

      console.error("Login failed", error);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-white to-purple-200 p-4 py-6">
      
      {/* CARD */}
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-5"
      >
        {/* TITLE */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">
            Login to continue managing your projects
          </p>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 p-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mt-1 p-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>

        {/* LINK */}
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
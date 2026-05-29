import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as apiclient from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: apiclient.RegisterUser,

    onSuccess: () => {
      toast.success("Registration successful!");
      navigate("/login");
    },

    onError: (error: any) => {
      toast.error(error.message, {
  position: "top-center",
  autoClose: 2000,
});
    },
  });


  const onSubmit = handleSubmit((data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutation.mutate(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-white to-purple-200 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white  rounded-2xl p-6 sm:p-8 space-y-5"
      >
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Create New Account
        </h1>

        {/* FIRST NAME */}
        <div>
          <input
            placeholder="First Name"
            className="w-full p-3 border rounded-lg text-base"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* LAST NAME */}
        <div>
          <input
            placeholder="Last Name"
            className="w-full p-3 border rounded-lg"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <input
            placeholder="Email"
            type="email"
            className="w-full p-3 border rounded-lg"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <input
            placeholder="Password"
            type="password"
            className="w-full p-3 border rounded-lg"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <input
            placeholder="Confirm Password"
            type="password"
            className="w-full p-3 border rounded-lg"
            {...register("confirmPassword", {
              required: "Confirm password is required",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 sm:py-3.5"
        >
          {mutation.isPending ? "Creating..." : "Create Account"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
       
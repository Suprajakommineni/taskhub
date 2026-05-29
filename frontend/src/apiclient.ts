import type { loginFormData } from "./pages/login";

export type LoginResponse = {
  token: string;
  msg: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export const loginUser = async (
  formData: loginFormData
): Promise<LoginResponse> => {

  const response = await fetch(
    `${API_BASE_URL}/users/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};
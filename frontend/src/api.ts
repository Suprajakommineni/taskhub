import type { RegisterFormData } from "./pages/register";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const RegisterUser = async (
  formData: RegisterFormData
) => {

  const response = await fetch(
    `${API_BASE_URL}/users/register`,
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
    throw new Error(data.msg || "Registration failed");
  }

  return data;
};
import type { RegisterFormData } from "./pages/register";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const RegisterUser = async (formData: RegisterFormData) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // ✅ auto-cancel after 8s

  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      signal: controller.signal, // ✅ cancel if too slow
    });

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || data.message || "Registration failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Network error, please try again");
  }
};

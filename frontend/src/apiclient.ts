import type { loginFormData } from "./pages/login";

export type LoginResponse = {
  token: string;
  msg: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const loginUser = async (
  formData: loginFormData
): Promise<LoginResponse> => {
  // ✅ Abort request if it hangs too long
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.msg || "Login failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Network error, please try again");
  }
};

export type TaskFormData = {
  title: string;
  projectId: string;
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }
  return response.json();
};

export const createTask = async (formData: TaskFormData) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  return handleResponse(response);
};

export const getTasks = async (projectId: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/tasks/${projectId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const updateTask = async (
  id: string,
  formData: { title?: string; completed?: boolean; priority?: string; dueDate?: string }
) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  return handleResponse(response);
};

export const deleteTask = async (id: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

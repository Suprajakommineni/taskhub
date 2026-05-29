export type TaskformData = {
    title: string;
    projectId: any;
    priority: "Low" | "Medium" | "High";
    duedate?: any;
};
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export const createTask = async (
    formData: TaskformData
) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_BASE_URL}/tasks`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        }
    );
    return response.json();
};
export const getTasks = async (projectId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_BASE_URL}/tasks/${projectId}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );
    return response.json();
}
export const updateTask = async (id: string, formData: {title?: string, completed?: boolean}) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_BASE_URL}/tasks/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        }
    );
    return response.json();
}
export const deleteTask = async (id: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_BASE_URL}/tasks/${id}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );
    return response.json();
}
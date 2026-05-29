export type ProjectFormData = {
  name: string;
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";


 const createProject = async (
  formData: ProjectFormData
) => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/projects`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  // IMPORTANT
  if (!response.ok) {
    throw new Error(data.message || "Failed to create project");
  }

  return data;
};
 const getProjects = async () => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/projects`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch projects");
  }

  return data;
};
 const deleteProject = async (
  projectId: string
) => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete project");
  }

  return data;
};
 const getProjectById = async (
  projectId: string
) => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch project");
  }

  return data;
};
 const updateProject = async (
  projectId: string,
  formData: { name: string }
) => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update project");
  }

  return data;
};
export { createProject, getProjects, deleteProject, getProjectById, updateProject };
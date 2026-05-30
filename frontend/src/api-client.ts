export type ProjectFormData = {
  name: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// ✅ Helper for fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");
  return token;
};

// ================= CREATE PROJECT =================
export const createProject = async (formData: ProjectFormData) => {
  const token = getToken();
  const response = await fetchWithTimeout(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create project");
  return data;
};

// ================= GET PROJECTS =================
export const getProjects = async () => {
  const token = getToken();
  const response = await fetchWithTimeout(`${API_BASE_URL}/projects`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch projects");
  return data;
};

// ================= DELETE PROJECT =================
export const deleteProject = async (projectId: string) => {
  const token = getToken();
  const response = await fetchWithTimeout(`${API_BASE_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete project");
  return data;
};

// ================= GET PROJECT BY ID =================
export const getProjectById = async (projectId: string) => {
  const token = getToken();
  const response = await fetchWithTimeout(`${API_BASE_URL}/projects/${projectId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch project");
  return data;
};

// ================= UPDATE PROJECT =================
export const updateProject = async (projectId: string, formData: { name: string }) => {
  const token = getToken();
  const response = await fetchWithTimeout(`${API_BASE_URL}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update project");
  return data;
};

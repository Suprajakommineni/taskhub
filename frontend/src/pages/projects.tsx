import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as apiclient from "../api-client";
import { motion } from "framer-motion";

type Project = {
  _id: string;
  name: string;
};

const Projects = () => {
  const [name, setName] = useState("");
  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ================= GET PROJECTS =================
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: apiclient.getProjects,
  });

  // ================= CREATE PROJECT =================
  const createMutation = useMutation({
    mutationFn: apiclient.createProject,
    onSuccess: () => {
      setName("");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // ================= UPDATE PROJECT =================
  const updateMutation = useMutation({
    mutationFn: ({
      projectId,
      formData,
    }: {
      projectId: string;
      formData: { name: string };
    }) => apiclient.updateProject(projectId, formData),

    onSuccess: () => {
      setName("");
      setEditingProjectId(null);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // ================= DELETE PROJECT =================
  const deleteMutation = useMutation({
    mutationFn: apiclient.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // ================= SUBMIT =================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProjectId) {
      updateMutation.mutate({
        projectId: editingProjectId,
        formData: { name },
      });
    } else {
      createMutation.mutate({ name });
    }
  };

  // ================= DELETE =================
  const handleDelete = (projectId: string) => {
    if (window.confirm("Delete this project?")) {
      deleteMutation.mutate(projectId);
    }
  };

  // ================= EDIT =================
  const handleEdit = (project: Project) => {
    setName(project.name);
    setEditingProjectId(project._id);
  };

  // ================= OPEN TASKS =================
  const handleOpenTasks = (projectId: string) => {
    navigate(`/tasks/${projectId}`);
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading projects...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Something went wrong
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-white to-purple-200 px-4 py-6 sm:px-8">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Projects ({projects?.length || 0})
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 active:scale-95 transition text-white px-5 py-3 rounded-xl font-semibold"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <div className="max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-2xl"
        >
          <input
            type="text"
            placeholder="Enter project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl p-3 text-base outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {editingProjectId
              ? updateMutation.isPending
                ? "Updating..."
                : "Update"
              : createMutation.isPending
              ? "Creating..."
              : "Create"}
          </button>
        </form>

        {/* EMPTY STATE */}
        {projects?.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
            No projects found 🚀
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

          {projects?.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white shadow-xl rounded-2xl p-5 flex flex-col gap-4"
            >
              {/* NAME */}
              <h2 className="text-xl font-bold text-gray-800 break-words">
                {project.name}
              </h2>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 bg-green-500 hover:bg-green-600 active:scale-95 transition text-white py-3 rounded-xl font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(project._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 transition text-white py-3 rounded-xl font-medium"
                >
                  Delete
                </button>
              </div>

              {/* TASK BUTTON */}
              <button
                onClick={() => handleOpenTasks(project._id)}
                className="bg-purple-600 hover:bg-purple-700 active:scale-95 transition text-white py-3 rounded-xl font-semibold"
              >
                Open Tasks
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
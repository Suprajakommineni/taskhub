import { useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiclient from "../apis";
import { motion } from "framer-motion";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
};

const Tasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // STATES
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // FILTER OPTIONS
  const filters = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
  ];

  // GET TASKS
  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ["tasks", projectId],
    queryFn: () => apiclient.getTasks(projectId as string),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });

  // RESET FORM
  const resetForm = useCallback(() => {
    setTitle("");
    setDueDate("");
    setPriority("Medium");
    setEditingTaskId(null);
  }, []);

  // CREATE
  const createMutation = useMutation({
    mutationFn: apiclient.createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const prevTasks = queryClient.getQueryData<Task[]>(["tasks", projectId]) || [];
      queryClient.setQueryData(["tasks", projectId], [...prevTasks, { ...newTask, _id: "temp", completed: false }]);
      return { prevTasks };
    },
    onError: (_err, _newTask, context) => {
      queryClient.setQueryData(["tasks", projectId], context?.prevTasks);
    },
    onSettled: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ taskId, formData }: { taskId: string; formData: any }) =>
      apiclient.updateTask(taskId, formData),
    onMutate: async ({ taskId, formData }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const prevTasks = queryClient.getQueryData<Task[]>(["tasks", projectId]) || [];
      queryClient.setQueryData(
        ["tasks", projectId],
        prevTasks.map((t) => (t._id === taskId ? { ...t, ...formData } : t))
      );
      return { prevTasks };
    },
    onError: (_err, _newTask, context) => {
      queryClient.setQueryData(["tasks", projectId], context?.prevTasks);
    },
    onSettled: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: apiclient.deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const prevTasks = queryClient.getQueryData<Task[]>(["tasks", projectId]) || [];
      queryClient.setQueryData(
        ["tasks", projectId],
        prevTasks.filter((t) => t._id !== taskId)
      );
      return { prevTasks };
    },
    onError: (_err, _taskId, context) => {
      queryClient.setQueryData(["tasks", projectId], context?.prevTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  // PRIORITY COLORS
  const getCardStyle = useCallback((task: Task) => {
    if (task.completed) return "border-gray-400 bg-gray-100";
    switch (task.priority) {
      case "High":
        return "border-red-500 bg-red-50";
      case "Medium":
        return "border-yellow-500 bg-yellow-50";
      case "Low":
        return "border-green-500 bg-green-50";
      default:
        return "border-gray-300";
    }
  }, []);

  // SUBMIT
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !projectId) return;

      const payload = { title, priority, dueDate: dueDate || undefined };

      if (editingTaskId) {
        updateMutation.mutate({ taskId: editingTaskId, formData: payload });
      } else {
        createMutation.mutate({ ...payload, projectId });
      }
    },
    [title, priority, dueDate, projectId, editingTaskId, updateMutation, createMutation]
  );

  // FILTER LOGIC (memoized)
  const filteredTasks = useMemo(() => {
    return tasks?.filter((task) => {
      const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all"
          ? true
          : filter === "completed"
          ? task.completed
          : !task.completed;
      return matchSearch && matchFilter;
    });
  }, [tasks, search, filter]);

  // LOADING
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading tasks...
      </div>
    );

  // ERROR
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading tasks
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-white to-purple-200 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            Tasks ({tasks?.length || 0})
          </h1>
          <button
            onClick={() => navigate("/projects")}
            className="bg-gray-800 text-white px-4 py-2 rounded-xl w-full sm:w-auto active:scale-95 transition"
          >
            Back
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row gap-3 mb-5"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="border p-2 flex-1 rounded-xl text-base"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="border p-2 rounded-xl"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded-xl text-base"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full sm:w-auto active:scale-95 transition">
            {editingTaskId ? "Update" : "Create"}
          </button>
        </form>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full p-3 border rounded-xl mb-4 text-base"
        />

        {/* FILTER */}
        <div className="flex gap-2 flex-wrap mb-5">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-2 rounded-xl text-sm sm:text-base active:scale-95 transition ${
                filter === f.key ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* TASKS */}
              {/* TASKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredTasks?.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 sm:p-5 rounded-xl border-2 shadow-md ${getCardStyle(task)}`}
            >
              {/* TITLE */}
              <h2
                className={`font-bold text-lg ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </h2>

              {/* PRIORITY */}
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-white text-sm bg-gray-700">
                {task.priority}
              </span>

              {/* DUE DATE */}
              <p className="text-sm text-gray-600 mt-2">
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No date"}
              </p>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() =>
                    updateMutation.mutate({
                      taskId: task._id,
                      formData: { completed: !task.completed },
                    })
                  }
                  className="bg-green-500 text-white px-3 py-2 rounded active:scale-95 transition"
                >
                  {task.completed ? "Undo" : "Done"}
                </button>

                <button
                  onClick={() => {
                    setTitle(task.title);
                    setPriority(task.priority);
                    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
                    setEditingTaskId(task._id);
                  }}
                  className="bg-yellow-500 text-white px-3 py-2 rounded active:scale-95 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteMutation.mutate(task._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded active:scale-95 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;

"use client";

import api from "@/axios/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import TaskForm from "@/components/TaskForm";
import TaskStats from "@/components/TaskStats";
import TaskList from "@/components/TaskList";

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  title: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "completed">("all");
  

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
    else fetchTasks();
  }, [router]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      
      // Handle different API response structures
      let tasksData = [];
      if (Array.isArray(response.data)) {
        tasksData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        tasksData = response.data.data;
      } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        tasksData = response.data.data.data;
      }
      
      setTasks(tasksData || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      if ((error as any).response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const addTask = async (data: TaskFormData) => {
    try {
      const response = await api.post("/tasks", data);

      // Extract the task from the response

      const newTask = response.data.data || response.data;
      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (error) {
      console.error("Failed to add task:", error);
      if ((error as any).response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (task: any) => {
    try {
      const taskData = task.data || task;
      const response = await api.put(`/tasks/${taskData.id}`, {
        ...taskData,
        completed: !taskData.completed,
      });
      
      // Extract the updated task from the response
      const updatedTask = response.data.data || response.data;
      setTasks(prevTasks => prevTasks.map(t => {
        const currentTask = t.data || t;
        return currentTask.id === taskData.id ? updatedTask : t;
      }));
    } catch (error) {
      console.error("Failed to toggle completion:", error);
      if ((error as any).response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prevTasks => prevTasks.filter(task => {
        const taskData = task.data || task;
        return taskData.id !== id;
      }));
    } catch (error) {
      console.error("Failed to delete task:", error);
      if ((error as any).response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    }
  };

  // Update task
  const updateTask = async (id: number, data: Partial<Task>) => {
    try {
      const response = await api.put(`/tasks/${id}`, data);
      // Extract the updated task from the response
      const updatedTask = response.data.data || response.data;
      setTasks(prevTasks => prevTasks.map(t => {
        const currentTask = t.data || t;
        return currentTask.id === id ? updatedTask : t;
      }));
    } catch (error) {
      console.error("Failed to update task:", error);
      if ((error as any).response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
      throw error;
    }
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const taskData = task.data || task;
    if (activeFilter === "active") return !taskData.completed;
    if (activeFilter === "completed") return taskData.completed;
    return true;
  });

  // Calculate counts
  const completedCount = tasks.filter(task => {
    const taskData = task.data || task;
    return taskData.completed;
  }).length;
  
  const activeCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-sans">
      <Header />
      
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Task Manager</h1>
          <p className="text-gray-600 text-lg">Organize your work and boost productivity</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Add Task Form and Stats */}
          <div className="lg:w-2/5">
            <TaskForm onSubmit={addTask} />
            <TaskStats completedCount={completedCount} activeCount={activeCount} totalCount={tasks.length} />
          </div>

          {/* Right Column - Tasks List */}
          <div className="lg:w-3/5">
            <TaskList
              tasks={filteredTasks}
              loading={loading}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onToggleCompletion={toggleTaskCompletion}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
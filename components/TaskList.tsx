import { Task } from "@/app/page";
import TaskFilter from "./TaskFilter";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: any[]; // Changed from Task[] to any[] to handle API response structure
  loading: boolean;
  activeFilter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  onToggleCompletion: (task: any) => void;
  onDeleteTask: (id: number) => void;
  onUpdateTask: (id: number, data: Partial<Task>) => Promise<void>;
}

export default function TaskList({
  tasks,
  loading,
  activeFilter,
  onFilterChange,
  onToggleCompletion,
  onDeleteTask,
  onUpdateTask
}: TaskListProps) {

  console.log("Tasks data:", tasks);
  
  // Extract the actual task data from the API response
  const extractedTasks = tasks.map(task => {
    // Handle different response structures
    return task.data || task;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
        <TaskFilter activeFilter={activeFilter} onFilterChange={onFilterChange} />
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading tasks...</p>
      ) : extractedTasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {activeFilter === "completed"
            ? "No completed tasks yet"
            : activeFilter === "active"
            ? "No active tasks - add one!"
            : "No tasks yet. Add a task to get started!"}
        </div>
      ) : (
        <div className="space-y-4">
          {extractedTasks.map(task => (
            <TaskItem
              key={task.id} // Use the actual task ID
              task={task}
              onToggleCompletion={onToggleCompletion}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
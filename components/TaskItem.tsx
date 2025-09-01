import { Task } from "@/app/page";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";

interface TaskItemProps {
  task: Task;
  onToggleCompletion: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onUpdateTask: (id: number, data: Partial<Task>) => Promise<void>;
}

export default function TaskItem({ task, onToggleCompletion, onDeleteTask, onUpdateTask }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSaveEdit = async (title: string, description: string) => {
    try {
      await onUpdateTask(task.id, { title, description });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditTaskForm
        task={task}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onToggleCompletion(task)}
            className={`flex items-center justify-center w-5 h-5 mt-1 rounded-full border ${
              task.completed ? "bg-blue-600 border-blue-600" : "border-gray-300"
            }`}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
          <div className="flex-1">
            <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>{task.title}</h3>
            {task.description && <p className={`text-sm mt-1 ${task.completed ? "line-through text-gray-400" : "text-gray-600"}`}>{task.description}</p>}
            <div className="text-xs text-gray-400 mt-2">Added {formatDate(task.created_at)}</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
          <button onClick={() => onDeleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}
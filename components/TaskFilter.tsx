interface TaskFilterProps {
  activeFilter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}

export default function TaskFilter({ activeFilter, onFilterChange }: TaskFilterProps) {
  const filters = ["all", "active", "completed"] as const;
  
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {filters.map(filter => (
        <button
          key={filter} // Added unique key
          onClick={() => onFilterChange(filter)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            activeFilter === filter
              ? "bg-white shadow-sm text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}
interface TaskStatsProps {
  completedCount: number;
  activeCount: number;
  totalCount: number;
}

export default function TaskStats({ completedCount, activeCount, totalCount }: TaskStatsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Completed</span>
            <span>{completedCount} / {totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: totalCount ? `${(completedCount / totalCount) * 100}%` : "0%" }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{activeCount}</div>
            <div className="text-xs text-blue-600 mt-1">Active Tasks</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{completedCount}</div>
            <div className="text-xs text-green-600 mt-1">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
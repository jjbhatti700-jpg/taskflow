"use client";

import { useTaskStore } from "../store/useTaskStore";

export default function ProgressBar() {
  const columns = useTaskStore((state) => state.columns);

  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);

  if (totalTasks === 0) return null;

  const colors = [
    "bg-green-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-gray-400",
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm mb-2">
        <span style={{ color: "var(--text-secondary)" }}>Progress</span>
        <span style={{ color: "var(--text-secondary)" }}>
          {totalTasks} total tasks
        </span>
      </div>
      <div
        className="h-3 rounded-full overflow-hidden flex"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {columns.map((column, index) => {
          const percent = (column.tasks.length / totalTasks) * 100;
          if (percent === 0) return null;
          return (
            <div
              key={column.id}
              className={`${colors[index % colors.length]} transition-all duration-300`}
              style={{ width: `${percent}%` }}
              title={`${column.title}: ${column.tasks.length}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 mt-2">
        {columns.map((column, index) => (
          <div key={column.id} className="flex items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}
            />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {column.title} ({column.tasks.length})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
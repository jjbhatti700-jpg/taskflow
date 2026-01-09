"use client";

import { useTaskStore } from "../store/useTaskStore";

export default function Stats() {
  const columns = useTaskStore((state) => state.columns);

  const allTasks = columns.flatMap((col) => col.tasks);
  const totalTasks = allTasks.length;

  const doneColumn = columns.find(
    (col) => col.title.toLowerCase() === "done" || col.title.toLowerCase() === "completed"
  );
  const completedTasks = doneColumn?.tasks.length || 0;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const inProgressColumn = columns.find(
    (col) =>
      col.title.toLowerCase() === "in progress" ||
      col.title.toLowerCase() === "doing"
  );
  const inProgressTasks = inProgressColumn?.tasks.length || 0;

  const incompleteTasks = allTasks.filter((task) => {
    const taskColumn = columns.find((col) =>
      col.tasks.some((t) => t.id === task.id)
    );
    return (
      taskColumn?.title.toLowerCase() !== "done" &&
      taskColumn?.title.toLowerCase() !== "completed"
    );
  });

  const highPriorityTasks = incompleteTasks.filter(
    (task) => task.priority === "high"
  ).length;

  const overdueTasks = incompleteTasks.filter((task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  const dueTodayTasks = incompleteTasks.filter((task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  }).length;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      color: "bg-blue-500",
    },
    {
      label: "Completed",
      value: `${completedTasks} (${completionRate}%)`,
      color: "bg-green-500",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      color: "bg-yellow-500",
    },
    {
      label: "High Priority",
      value: highPriorityTasks,
      color: "bg-red-500",
    },
    {
      label: "Overdue",
      value: overdueTasks,
      color: overdueTasks > 0 ? "bg-red-600" : "bg-gray-400",
    },
    {
      label: "Due Today",
      value: dueTodayTasks,
      color: dueTodayTasks > 0 ? "bg-orange-500" : "bg-gray-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${stat.color}`} />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {stat.label}
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useTaskStore } from "../store/useTaskStore";
import TaskModal from "./TaskModal";

type Priority = "low" | "medium" | "high";

type TaskCardProps = {
  id: string;
  columnId: "todo" | "inProgress" | "done";
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  labelIds: string[];
};

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

function getDueDateStatus(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: "Overdue", className: "bg-red-500 text-white" };
  } else if (diffDays === 0) {
    return { label: "Today", className: "bg-orange-500 text-white" };
  } else if (diffDays === 1) {
    return { label: "Tomorrow", className: "bg-yellow-500 text-white" };
  } else if (diffDays <= 7) {
    return { label: `${diffDays} days`, className: "bg-blue-100 text-blue-800" };
  } else {
    return { label: dueDate, className: "bg-gray-100 text-gray-600" };
  }
}

export default function TaskCard({
  id,
  columnId,
  title,
  description,
  priority,
  dueDate,
  labelIds,
}: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const labels = useTaskStore((state) => state.labels);

  const taskLabels = labels.filter((label) => (labelIds || []).includes(label.id));

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { columnId },
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
  };

  const dueDateStatus = dueDate ? getDueDateStatus(dueDate) : null;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={() => setIsModalOpen(true)}
        className="p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      >
        {taskLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {taskLabels.map((label) => (
              <span
                key={label.id}
                className="text-xs px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-medium" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
        {description && (
          <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded ${priorityColors[priority]}`}>
            {priority}
          </span>
          {dueDateStatus && (
            <span className={`text-xs px-2 py-1 rounded ${dueDateStatus.className}`}>
              {dueDateStatus.label}
            </span>
          )}
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          id={id}
          columnId={columnId}
          title={title}
          description={description}
          priority={priority}
          dueDate={dueDate}
          labelIds={labelIds || []}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
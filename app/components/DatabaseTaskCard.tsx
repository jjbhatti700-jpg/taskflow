"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

type Label = {
  id: string;
  name: string;
  color: string;
};

type DatabaseTaskCardProps = {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
  taskLabels: Label[];
  allLabels: Label[];
  onUpdate: (taskId: string, updates: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddLabel: (taskId: string, labelId: string) => void;
  onRemoveLabel: (taskId: string, labelId: string) => void;
};

const priorityColors: Record<string, string> = {
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
    const formatted = new Date(dueDate).toLocaleDateString();
    return { label: formatted, className: "bg-gray-100 text-gray-600" };
  }
}

export default function DatabaseTaskCard({
  id,
  columnId,
  title,
  description,
  priority,
  dueDate,
  taskLabels,
  allLabels,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddLabel,
  onRemoveLabel,
}: DatabaseTaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || "");
  const [editPriority, setEditPriority] = useState(priority);
  const [editDueDate, setEditDueDate] = useState(dueDate ? dueDate.split("T")[0] : "");

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { columnId },
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
  };

  const handleSave = () => {
    onUpdate(id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      dueDate: editDueDate || undefined,
    });
    setIsModalOpen(false);
  };

  const toggleLabel = (labelId: string) => {
    const hasLabel = taskLabels.some((l) => l.id === labelId);
    if (hasLabel) {
      onRemoveLabel(id, labelId);
    } else {
      onAddLabel(id, labelId);
    }
  };

  const dueDateStatus = dueDate ? getDueDateStatus(dueDate) : null;
  const taskLabelIds = taskLabels.map((l) => l.id);

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
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="rounded-lg p-6 w-full max-w-md shadow-xl my-auto"
            style={{ backgroundColor: "var(--bg-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Edit Task
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 rounded"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded resize-none"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full p-2 rounded"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full p-2 rounded"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Labels
                </label>
                <div className="flex flex-wrap gap-2">
                  {allLabels.length === 0 ? (
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      No labels available
                    </span>
                  ) : (
                    allLabels.map((label) => (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() => toggleLabel(label.id)}
                        className="text-sm px-3 py-1 rounded-full border-2 transition-all"
                        style={{
                          backgroundColor: taskLabelIds.includes(label.id) ? label.color : "transparent",
                          borderColor: label.color,
                          color: taskLabelIds.includes(label.id) ? "white" : label.color,
                        }}
                      >
                        {label.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <div className="flex gap-2">
                <button onClick={onDelete} className="text-red-500 hover:text-red-700 text-sm">
                  Delete
                </button>
                <button
                  onClick={() => {
                    onDuplicate();
                    setIsModalOpen(false);
                  }}
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Duplicate
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
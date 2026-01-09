"use client";

import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

type Priority = "low" | "medium" | "high";

type TaskModalProps = {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  labelIds: string[];
  onClose: () => void;
};

export default function TaskModal({
  id,
  columnId,
  title,
  description,
  priority,
  dueDate,
  labelIds,
  onClose,
}: TaskModalProps) {
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || "");
  const [editPriority, setEditPriority] = useState<Priority>(priority);
  const [editDueDate, setEditDueDate] = useState(dueDate || "");
  const [editLabelIds, setEditLabelIds] = useState<string[]>(labelIds);

  const editTask = useTaskStore((state) => state.editTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const duplicateTask = useTaskStore((state) => state.duplicateTask);
  const labels = useTaskStore((state) => state.labels);
  const columns = useTaskStore((state) => state.columns);

  const handleSave = () => {
    if (!editTitle.trim()) return;

    editTask(columnId, id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      dueDate: editDueDate || undefined,
      labelIds: editLabelIds,
    });
    onClose();
  };

  const handleDelete = () => {
    deleteTask(columnId, id);
    onClose();
  };

  const handleDuplicate = () => {
    duplicateTask(columnId, id);
    onClose();
  };

  const toggleLabel = (labelId: string) => {
    if (editLabelIds.includes(labelId)) {
      setEditLabelIds(editLabelIds.filter((id) => id !== labelId));
    } else {
      setEditLabelIds([...editLabelIds, labelId]);
    }
  };

  const currentColumn = columns.find((col) => col.id === columnId);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="rounded-lg p-6 w-full max-w-md shadow-xl my-auto"
        style={{ backgroundColor: "var(--bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Edit Task
          </h2>
          <span
            className="text-sm px-2 py-1 rounded"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
            }}
          >
            {currentColumn?.title}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Due Date
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                }}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Labels
            </label>
            <div className="flex flex-wrap gap-2">
              {labels.length === 0 ? (
                <span style={{ color: "var(--text-secondary)" }} className="text-sm">
                  No labels created yet
                </span>
              ) : (
                labels.map((label) => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    className="text-sm px-3 py-1 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: editLabelIds.includes(label.id)
                        ? label.color
                        : "transparent",
                      borderColor: label.color,
                      color: editLabelIds.includes(label.id) ? "white" : label.color,
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
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
            <button
              onClick={handleDuplicate}
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Duplicate
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
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
  );
}
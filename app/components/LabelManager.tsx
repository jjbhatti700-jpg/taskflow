"use client";

import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

type LabelManagerProps = {
  onClose: () => void;
};

const colorOptions = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

export default function LabelManager({ onClose }: LabelManagerProps) {
  const [newLabelName, setNewLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const labels = useTaskStore((state) => state.labels);
  const addLabel = useTaskStore((state) => state.addLabel);
  const deleteLabel = useTaskStore((state) => state.deleteLabel);

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;

    addLabel({
      id: Date.now().toString(),
      name: newLabelName.trim(),
      color: selectedColor,
    });

    setNewLabelName("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="rounded-lg p-6 w-full max-w-md shadow-xl"
        style={{ backgroundColor: "var(--bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Manage Labels
        </h2>

        <form onSubmit={handleAddLabel} className="mb-6">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="New label name"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              className="flex-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color ? "border-white ring-2 ring-offset-2 ring-blue-500" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {labels.length === 0 ? (
            <p className="text-center py-4" style={{ color: "var(--text-secondary)" }}>
              No labels yet
            </p>
          ) : (
            labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center justify-between p-2 rounded"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  <span style={{ color: "var(--text-primary)" }}>{label.name}</span>
                </div>
                <button
                  onClick={() => deleteLabel(label.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
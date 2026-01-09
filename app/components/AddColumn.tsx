"use client";

import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

export default function AddColumn() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const addColumn = useTaskStore((state) => state.addColumn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addColumn(title.trim());
    setTitle("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="h-fit p-4 rounded-lg w-80 flex-shrink-0 border-2 border-dashed transition-colors"
        style={{
          borderColor: "var(--border-color)",
          color: "var(--text-secondary)",
        }}
      >
        + Add Column
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-lg w-80 flex-shrink-0"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <input
        type="text"
        placeholder="Column title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        }}
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1 rounded text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
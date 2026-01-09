"use client";

import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

type Priority = "low" | "medium" | "high";

type AddTaskFormProps = {
  columnId: "todo" | "inProgress" | "done";
};

export default function AddTaskForm({ columnId }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask(columnId, {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      labelIds: [],
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-2 rounded-lg transition-colors text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        + Add task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 rounded-lg shadow-sm"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
      }}
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        }}
        autoFocus
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={2}
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        }}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="w-full p-2 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
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
"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useTaskStore } from "../store/useTaskStore";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";

type Priority = "low" | "medium" | "high";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  labelIds: string[];
};

type ColumnProps = {
  id: string;
  title: string;
  tasks: Task[];
};

export default function Column({ id, title, tasks }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const editColumn = useTaskStore((state) => state.editColumn);
  const deleteColumn = useTaskStore((state) => state.deleteColumn);
  const columns = useTaskStore((state) => state.columns);

  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      editColumn(id, editTitle.trim());
    } else {
      setEditTitle(title);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (columns.length <= 1) {
      alert("You must have at least one column");
      return;
    }
    if (tasks.length > 0) {
      if (!confirm(`Delete "${title}" and its ${tasks.length} task(s)?`)) {
        return;
      }
    }
    deleteColumn(id);
  };

  return (
    <div
      ref={setNodeRef}
      className="p-4 rounded-lg w-80 flex-shrink-0 transition-colors"
      style={{
        backgroundColor: isOver ? "var(--border-color)" : "var(--bg-secondary)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTitle();
              if (e.key === "Escape") {
                setEditTitle(title);
                setIsEditing(false);
              }
            }}
            className="font-semibold p-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
            autoFocus
          />
        ) : (
          <h2
            className="font-semibold cursor-pointer"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setIsEditing(true)}
            title="Click to edit"
          >
            {title}
          </h2>
        )}
        <div className="flex items-center gap-2">
          <span
            className="text-sm px-2 py-1 rounded-full"
            style={{
              backgroundColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            {tasks.length}
          </span>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 text-sm"
            title="Delete column"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            columnId={id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            dueDate={task.dueDate}
            labelIds={task.labelIds}
          />
        ))}
        <AddTaskForm columnId={id} />
      </div>
    </div>
  );
}
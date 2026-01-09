"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import DatabaseTaskCard from "./DatabaseTaskCard";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
  labels: { label: { id: string; name: string; color: string } }[];
};

type Label = {
  id: string;
  name: string;
  color: string;
};

type DatabaseColumnProps = {
  id: string;
  title: string;
  tasks: Task[];
  labels: Label[];
  searchQuery: string;
  filterPriority: string;
  filterLabel: string;
  sortBy: "none" | "priority" | "dueDate" | "title";
  onAddTask: (task: { title: string; description?: string; priority: string; dueDate?: string }) => void;
  onUpdateTask: (taskId: string, updates: any) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (taskId: string) => void;
  onUpdateColumn: (title: string) => void;
  onDeleteColumn: () => void;
  onAddLabel: (taskId: string, labelId: string) => void;
  onRemoveLabel: (taskId: string, labelId: string) => void;
};

const priorityOrder: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function DatabaseColumn({
  id,
  title,
  tasks,
  labels,
  searchQuery,
  filterPriority,
  filterLabel,
  sortBy,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onDuplicateTask,
  onUpdateColumn,
  onDeleteColumn,
  onAddLabel,
  onRemoveLabel,
}: DatabaseColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const { setNodeRef, isOver } = useDroppable({ id });

  // Filter and sort tasks
  let filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;

    const taskLabelIds = task.labels?.map((l) => l.label.id) || [];
    const matchesLabel = filterLabel === "all" || taskLabelIds.includes(filterLabel);

    return matchesSearch && matchesPriority && matchesLabel;
  });

  if (sortBy === "priority") {
    filteredTasks = [...filteredTasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (sortBy === "dueDate") {
    filteredTasks = [...filteredTasks].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  } else if (sortBy === "title") {
    filteredTasks = [...filteredTasks].sort((a, b) => a.title.localeCompare(b.title));
  }

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      onUpdateColumn(editTitle.trim());
    } else {
      setEditTitle(title);
    }
    setIsEditing(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
    });

    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
    setNewTaskDueDate("");
    setIsAddingTask(false);
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
            {filteredTasks.length}
          </span>
          <button
            onClick={onDeleteColumn}
            className="text-gray-400 hover:text-red-500 text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-h-[100px]">
        {filteredTasks.map((task) => (
          <DatabaseTaskCard
            key={task.id}
            id={task.id}
            columnId={id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            dueDate={task.dueDate}
            taskLabels={task.labels?.map((l) => l.label) || []}
            allLabels={labels}
            onUpdate={onUpdateTask}
            onDelete={() => onDeleteTask(task.id)}
            onDuplicate={() => onDuplicateTask(task.id)}
            onAddLabel={onAddLabel}
            onRemoveLabel={onRemoveLabel}
          />
        ))}

        {isAddingTask ? (
          <form
            onSubmit={handleAddTask}
            className="p-3 rounded-lg"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}
          >
            <input
              type="text"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full p-2 rounded mb-2 text-sm focus:outline-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              rows={2}
              className="w-full p-2 rounded mb-2 text-sm focus:outline-none resize-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="w-full p-2 rounded mb-2 text-sm"
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
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="w-full p-2 rounded mb-2 text-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full p-2 rounded-lg text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            + Add task
          </button>
        )}
      </div>
    </div>
  );
}
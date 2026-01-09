"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensors, useSensor } from "@dnd-kit/core";
import { useProject } from "../hooks/useProject";
import DatabaseColumn from "./DatabaseColumn";
import DatabaseAddColumn from "./DatabaseAddColumn";
import DatabaseLabelManager from "./DatabaseLabelManager";
import Header from "./Header";
import HelpModal from "./HelpModal";

export default function DatabaseBoard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterLabel, setFilterLabel] = useState("all");
  const [sortBy, setSortBy] = useState<"none" | "priority" | "dueDate" | "title">("none");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLabelManagerOpen, setIsLabelManagerOpen] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const {
    project,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
    addLabel,
    deleteLabel,
    addLabelToTask,
    removeLabelFromTask,
  } = useProject();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const toColumnId = over.id as string;
    const fromColumnId = active.data.current?.columnId;

    if (fromColumnId && fromColumnId !== toColumnId) {
      moveTask(taskId, toColumnId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <p style={{ color: "var(--text-primary)" }}>Loading...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <p className="text-red-500">{error || "Failed to load project"}</p>
      </div>
    );
  }

  const labels = project.labels || [];
  const allTasks = project.columns.flatMap((col) => col.tasks);
  const totalTasks = allTasks.length;

  const doneColumn = project.columns.find(
    (col) => col.title.toLowerCase() === "done" || col.title.toLowerCase() === "completed"
  );
  const completedTasks = doneColumn?.tasks.length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const inProgressColumn = project.columns.find(
    (col) => col.title.toLowerCase() === "in progress" || col.title.toLowerCase() === "doing"
  );
  const inProgressTasks = inProgressColumn?.tasks.length || 0;

  const incompleteTasks = allTasks.filter((task) => {
    const taskColumn = project.columns.find((col) => col.tasks.some((t) => t.id === task.id));
    return taskColumn?.title.toLowerCase() !== "done" && taskColumn?.title.toLowerCase() !== "completed";
  });

  const highPriorityTasks = incompleteTasks.filter((task) => task.priority === "high").length;

  const overdueTasks = incompleteTasks.filter((task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  const stats = [
    { label: "Total Tasks", value: totalTasks, color: "bg-blue-500" },
    { label: "Completed", value: `${completedTasks} (${completionRate}%)`, color: "bg-green-500" },
    { label: "In Progress", value: inProgressTasks, color: "bg-yellow-500" },
    { label: "High Priority", value: highPriorityTasks, color: "bg-red-500" },
    { label: "Overdue", value: overdueTasks, color: overdueTasks > 0 ? "bg-red-600" : "bg-gray-400" },
  ];

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterPriority={filterPriority}
        onFilterChange={setFilterPriority}
        filterLabel={filterLabel}
        onFilterLabelChange={setFilterLabel}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenLabels={() => setIsLabelManagerOpen(true)}
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
        labels={labels}
      />

      {showStats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    {stat.label}
                  </span>
                </div>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {totalTasks > 0 && (
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: "var(--text-secondary)" }}>Progress</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  {completedTasks} of {totalTasks} tasks completed
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: "var(--bg-secondary)" }}>
                {project.columns.map((column, index) => {
                  const percent = (column.tasks.length / totalTasks) * 100;
                  if (percent === 0) return null;
                  const colors = ["bg-green-500", "bg-yellow-500", "bg-blue-500", "bg-purple-500", "bg-pink-500"];
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
                {project.columns.map((column, index) => {
                  const colors = ["bg-green-500", "bg-yellow-500", "bg-blue-500", "bg-purple-500", "bg-pink-500"];
                  return (
                    <div key={column.id} className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {column.title} ({column.tasks.length})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {project.columns.map((column) => (
            <DatabaseColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={column.tasks}
              labels={labels}
              searchQuery={searchQuery}
              filterPriority={filterPriority}
              filterLabel={filterLabel}
              sortBy={sortBy}
              onAddTask={(task) => addTask(column.id, task)}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onDuplicateTask={duplicateTask}
              onUpdateColumn={(title) => updateColumn(column.id, title)}
              onDeleteColumn={() => deleteColumn(column.id)}
              onAddLabel={addLabelToTask}
              onRemoveLabel={removeLabelFromTask}
            />
          ))}
          <DatabaseAddColumn onAddColumn={addColumn} />
        </div>
      </DndContext>

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      
      {isLabelManagerOpen && (
        <DatabaseLabelManager
          labels={labels}
          onAddLabel={addLabel}
          onDeleteLabel={deleteLabel}
          onClose={() => setIsLabelManagerOpen(false)}
        />
      )}
    </>
  );
}
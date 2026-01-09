"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTaskStore } from "../store/useTaskStore";
import SortableColumn from "./SortableColumn";
import AddColumn from "./AddColumn";
import Header from "./Header";
import Stats from "./Stats";
import ProgressBar from "./ProgressBar";
import KeyboardShortcuts from "./KeyboardShortcuts";
import HelpModal from "./HelpModal";

type SortOption = "none" | "priority" | "dueDate" | "title";
type Priority = "low" | "medium" | "high";

const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function Board() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterLabel, setFilterLabel] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const columns = useTaskStore((state) => state.columns);
  const moveTask = useTaskStore((state) => state.moveTask);
  const reorderColumns = useTaskStore((state) => state.reorderColumns);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle column reordering
    if (activeId.startsWith("column-") && overId.startsWith("column-")) {
      const fromColumnId = activeId.replace("column-", "");
      const toColumnId = overId.replace("column-", "");

      const fromIndex = columns.findIndex((col) => col.id === fromColumnId);
      const toIndex = columns.findIndex((col) => col.id === toColumnId);

      if (fromIndex !== toIndex) {
        reorderColumns(fromIndex, toIndex);
      }
      return;
    }

    // Handle task moving between columns
    const fromColumnId = active.data.current?.columnId as string;
    const toColumnId = overId;

    if (fromColumnId && toColumnId && fromColumnId !== toColumnId) {
      moveTask(activeId, fromColumnId, toColumnId);
    }
  };

  const filterAndSortTasks = (tasks: typeof columns[0]["tasks"]) => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;

      const matchesLabel =
        filterLabel === "all" || (task.labelIds || []).includes(filterLabel);

      return matchesSearch && matchesPriority && matchesLabel;
    });

    if (sortBy === "priority") {
      filtered = [...filtered].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else if (sortBy === "dueDate") {
      filtered = [...filtered].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else if (sortBy === "title") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  };

  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);
  const filteredTotal = columns.reduce(
    (sum, col) => sum + filterAndSortTasks(col.tasks).length,
    0
  );

  const columnIds = columns.map((col) => `column-${col.id}`);

  return (
    <>
      <KeyboardShortcuts onOpenHelp={() => setIsHelpOpen(true)} />

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
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
      />

      {showStats && (
        <>
          <Stats />
          <ProgressBar />
        </>
      )}

      {totalTasks !== filteredTotal && (
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Showing {filteredTotal} of {totalTasks} tasks
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <SortableColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={filterAndSortTasks(column.tasks)}
              />
            ))}
            <AddColumn />
          </div>
        </SortableContext>
      </DndContext>

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </>
  );
}
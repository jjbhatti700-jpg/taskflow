"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Column from "./Column";

type Priority = "low" | "medium" | "high";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  labelIds: string[];
};

type SortableColumnProps = {
  id: string;
  title: string;
  tasks: Task[];
};

export default function SortableColumn({ id, title, tasks }: SortableColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `column-${id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className="cursor-grab active:cursor-grabbing mb-2 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 inline-block"
        {...attributes}
        {...listeners}
      >
        <span style={{ color: "var(--text-secondary)" }} className="text-xs">
          ⠿ Drag to reorder
        </span>
      </div>
      <Column id={id} title={title} tasks={tasks} />
    </div>
  );
}
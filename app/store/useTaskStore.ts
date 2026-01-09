import { create } from "zustand";
import { persist } from "zustand/middleware";

type Priority = "low" | "medium" | "high";

type Label = {
  id: string;
  name: string;
  color: string;
};

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  labelIds: string[];
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

type TaskStore = {
  columns: Column[];
  labels: Label[];
  addTask: (columnId: string, task: Task) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  editTask: (columnId: string, taskId: string, updates: Partial<Task>) => void;
  duplicateTask: (columnId: string, taskId: string) => void;
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  editColumn: (columnId: string, title: string) => void;
  reorderColumns: (fromIndex: number, toIndex: number) => void;
  addLabel: (label: Label) => void;
  deleteLabel: (labelId: string) => void;
};

const defaultLabels: Label[] = [
  { id: "1", name: "Bug", color: "#ef4444" },
  { id: "2", name: "Feature", color: "#3b82f6" },
  { id: "3", name: "Design", color: "#8b5cf6" },
];

const defaultColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "1", title: "Research competitors", description: "Look at Jira, Linear, Trello", priority: "medium", labelIds: ["2"] },
      { id: "2", title: "Setup project", description: "Initialize Next.js app", priority: "high", labelIds: [] },
    ],
  },
  {
    id: "inProgress",
    title: "In Progress",
    tasks: [
      { id: "3", title: "Build kanban board", description: "Create columns and cards", priority: "high", labelIds: ["2"] },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      { id: "4", title: "Create repo", description: "Setup GitHub repository", priority: "low", labelIds: [] },
    ],
  },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      columns: defaultColumns,
      labels: defaultLabels,
      addTask: (columnId, task) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
          ),
        })),
      deleteTask: (columnId, taskId) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
              : col
          ),
        })),
      editTask: (columnId, taskId, updates) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  tasks: col.tasks.map((task) =>
                    task.id === taskId ? { ...task, ...updates } : task
                  ),
                }
              : col
          ),
        })),
        duplicateTask: (columnId, taskId) =>
  set((state) => {
    const column = state.columns.find((col) => col.id === columnId);
    const task = column?.tasks.find((t) => t.id === taskId);
    if (!task) return state;

    const newTask = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (copy)`,
    };

    return {
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      ),
    };
  }),
      moveTask: (taskId, fromColumnId, toColumnId) =>
        set((state) => {
          const fromColumn = state.columns.find((col) => col.id === fromColumnId);
          const task = fromColumn?.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          return {
            columns: state.columns.map((col) => {
              if (col.id === fromColumnId) {
                return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
              }
              if (col.id === toColumnId) {
                return { ...col, tasks: [...col.tasks, task] };
              }
              return col;
            }),
          };
        }),
      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: Date.now().toString(), title, tasks: [] },
          ],
        })),
      deleteColumn: (columnId) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== columnId),
        })),
      editColumn: (columnId, title) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, title } : col
          ),
        })),
      reorderColumns: (fromIndex, toIndex) =>
        set((state) => {
          const newColumns = [...state.columns];
          const [removed] = newColumns.splice(fromIndex, 1);
          newColumns.splice(toIndex, 0, removed);
          return { columns: newColumns };
        }),
      addLabel: (label) =>
        set((state) => ({
          labels: [...state.labels, label],
        })),
      deleteLabel: (labelId) =>
        set((state) => ({
          labels: state.labels.filter((l) => l.id !== labelId),
        })),
    }),
    {
      name: "taskflow-storage",
    }
  )
);
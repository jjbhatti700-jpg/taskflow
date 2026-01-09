"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "../context/ThemeContext";

type SortOption = "none" | "priority" | "dueDate" | "title";

type Label = {
  id: string;
  name: string;
  color: string;
};

type HeaderProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterPriority: string;
  onFilterChange: (priority: string) => void;
  filterLabel: string;
  onFilterLabelChange: (labelId: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenHelp: () => void;
  onOpenLabels: () => void;
  showStats: boolean;
  onToggleStats: () => void;
  labels: Label[];
};

export default function Header({
  searchQuery,
  onSearchChange,
  filterPriority,
  onFilterChange,
  filterLabel,
  onFilterLabelChange,
  sortBy,
  onSortChange,
  onOpenHelp,
  onOpenLabels,
  showStats,
  onToggleStats,
  labels,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  const hasActiveFilters =
    searchQuery ||
    filterPriority !== "all" ||
    filterLabel !== "all" ||
    sortBy !== "none";

  return (
    <header className="mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            TaskFlow
          </h1>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
            {session?.user?.name
              ? `Welcome, ${session.user.name}`
              : "Your project management tool"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end items-center">
          <button
            onClick={onToggleStats}
            className="px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
            title={showStats ? "Hide stats" : "Show stats"}
          >
            📊
          </button>
          <button
            onClick={onOpenHelp}
            className="px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
            title="Keyboard shortcuts"
          >
            ?
          </button>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            onClick={onOpenLabels}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Labels
          </button>
          {session?.user && (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-4 py-2 rounded-lg w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
        />

        <select
          value={filterPriority}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filterLabel}
          onChange={(e) => onFilterLabelChange(e.target.value)}
          className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <option value="all">All Labels</option>
          {labels.map((label) => (
            <option key={label.id} value={label.id}>
              {label.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <option value="none">No Sorting</option>
          <option value="priority">Sort by Priority</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="title">Sort by Title</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearchChange("");
              onFilterChange("all");
              onFilterLabelChange("all");
              onSortChange("none");
            }}
            className="px-3 py-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Clear all
          </button>
        )}
      </div>
    </header>
  );
}
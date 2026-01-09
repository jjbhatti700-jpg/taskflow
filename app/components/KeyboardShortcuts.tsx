"use client";

import { useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useTheme } from "../context/ThemeContext";

type KeyboardShortcutsProps = {
  onOpenHelp: () => void;
};

export default function KeyboardShortcuts({ onOpenHelp }: KeyboardShortcutsProps) {
  const { toggleTheme } = useTheme();
  const addTask = useTaskStore((state) => state.addTask);
  const columns = useTaskStore((state) => state.columns);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === "?" || (e.key === "/" && !e.ctrlKey)) {
        e.preventDefault();
        onOpenHelp();
      }

      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        toggleTheme();
      }

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        const firstColumn = columns[0];
        if (firstColumn) {
          addTask(firstColumn.id, {
            id: Date.now().toString(),
            title: "New Task",
            description: "",
            priority: "medium",
            labelIds: [],
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme, addTask, columns, onOpenHelp]);

  return null;
}
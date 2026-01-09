"use client";

import { useRef } from "react";
import { useTaskStore } from "../store/useTaskStore";

type ExportImportProps = {
  onClose: () => void;
};

export default function ExportImport({ onClose }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const columns = useTaskStore((state) => state.columns);
  const labels = useTaskStore((state) => state.labels);

  const handleExport = () => {
    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      columns,
      labels,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (!data.columns || !Array.isArray(data.columns)) {
          alert("Invalid backup file: missing columns data");
          return;
        }

        if (!data.labels || !Array.isArray(data.labels)) {
          alert("Invalid backup file: missing labels data");
          return;
        }

        // Clear current data and import new data
        localStorage.setItem(
          "taskflow-storage",
          JSON.stringify({
            state: {
              columns: data.columns,
              labels: data.labels,
            },
            version: 0,
          })
        );

        alert("Import successful! The page will reload.");
        window.location.reload();
      } catch (error) {
        alert("Failed to import: Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to delete ALL tasks and columns? This cannot be undone!"
      )
    ) {
      localStorage.removeItem("taskflow-storage");
      alert("All data cleared! The page will reload.");
      window.location.reload();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="rounded-lg p-6 w-full max-w-md shadow-xl my-auto"
        style={{ backgroundColor: "var(--bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-xl font-semibold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Export & Import
        </h2>

        <div className="space-y-4">
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <h3
              className="font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Export Backup
            </h3>
            <p
              className="text-sm mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Download all your tasks, columns, and labels as a JSON file.
            </p>
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              📥 Export Data
            </button>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <h3
              className="font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Import Backup
            </h3>
            <p
              className="text-sm mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Restore from a previously exported JSON file. This will replace
              all current data.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              📤 Import Data
            </button>
          </div>

          <div
            className="p-4 rounded-lg border-2 border-red-500/50"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <h3 className="font-medium mb-2 text-red-500">Danger Zone</h3>
            <p
              className="text-sm mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Permanently delete all tasks, columns, and labels.
            </p>
            <button
              onClick={handleClearData}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
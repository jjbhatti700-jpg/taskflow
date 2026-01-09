"use client";

type HelpModalProps = {
  onClose: () => void;
};

const shortcuts = [
  { key: "N", description: "Create new task in first column" },
  { key: "D", description: "Toggle dark/light mode" },
  { key: "?", description: "Show this help" },
];

const features = [
  "Drag tasks between columns",
  "Drag columns to reorder them",
  "Click column title to rename",
  "Click ✕ to delete column",
  "Filter by priority, label, or search",
  "Sort tasks by priority, due date, or title",
];

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Keyboard Shortcuts
        </h2>

        <div className="space-y-3 mb-6">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex justify-between items-center">
              <span style={{ color: "var(--text-secondary)" }}>
                {shortcut.description}
              </span>
              <kbd
                className="px-3 py-1 rounded text-sm font-mono"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Features
        </h3>

        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-2"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
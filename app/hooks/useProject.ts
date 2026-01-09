"use client";

import { useState, useEffect, useCallback } from "react";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
  order: number;
  columnId: string;
  labels: { label: { id: string; name: string; color: string } }[];
};

type Column = {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
};

type Label = {
  id: string;
  name: string;
  color: string;
};

type Project = {
  id: string;
  name: string;
  columns: Column[];
  labels: Label[];
};

export function useProject() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");
      const projects = await response.json();

      if (projects.length === 0) {
        const createResponse = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "My Project" }),
        });
        await createResponse.json();

        const refetchResponse = await fetch("/api/projects");
        const refetchedProjects = await refetchResponse.json();
        setProject(refetchedProjects[0]);
      } else {
        setProject(projects[0]);
      }
    } catch (err) {
      setError("Failed to load project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const addTask = async (
    columnId: string,
    task: { title: string; description?: string; priority: string; dueDate?: string }
  ) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId, ...task }),
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const updateTask = async (
    taskId: string,
    updates: {
      title?: string;
      description?: string;
      priority?: string;
      dueDate?: string;
      columnId?: string;
    }
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const duplicateTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to duplicate task:", err);
    }
  };

  const moveTask = async (taskId: string, toColumnId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId: toColumnId }),
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to move task:", err);
    }
  };

  const addColumn = async (title: string) => {
    if (!project) return;
    try {
      const response = await fetch("/api/columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, title }),
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to add column:", err);
    }
  };

  const updateColumn = async (columnId: string, title: string) => {
    try {
      const response = await fetch(`/api/columns/${columnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to update column:", err);
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      const response = await fetch(`/api/columns/${columnId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to delete column:", err);
    }
  };

  const addLabel = async (name: string, color: string) => {
    if (!project) return;
    try {
      const response = await fetch("/api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, name, color }),
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to add label:", err);
    }
  };

  const deleteLabel = async (labelId: string) => {
    try {
      const response = await fetch(`/api/labels/${labelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to delete label:", err);
    }
  };

  const addLabelToTask = async (taskId: string, labelId: string) => {
    try {
      const response = await fetch("/api/task-labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, labelId }),
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to add label to task:", err);
    }
  };

  const removeLabelFromTask = async (taskId: string, labelId: string) => {
    try {
      const response = await fetch("/api/task-labels", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, labelId }),
      });

      if (response.ok) {
        await fetchProject();
      }
    } catch (err) {
      console.error("Failed to remove label from task:", err);
    }
  };

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
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
  };
}
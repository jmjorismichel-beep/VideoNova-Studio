// hooks/useProject.ts
// Hook React pour charger, sauvegarder et manipuler un projet

import { useState, useCallback } from "react";
import { useEditorStore } from "@/stores/editor-store";

export function useProject(projectId: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { project, setIsSaving: setStoreSaving, setIsDirty } = useEditorStore();

  // Sauvegarde manuelle du projet
  const saveProject = useCallback(async () => {
    if (!project) return;
    setIsSaving(true);
    setStoreSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: project.nom,
          content: project,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de sauvegarde");
      }

      setIsDirty(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSaving(false);
      setStoreSaving(false);
    }
  }, [project, projectId, setStoreSaving, setIsDirty]);

  // Déclenchement de l'export MP4
  const exportVideo = useCallback(async (): Promise<string | null> => {
    if (!project) return null;

    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors du déclenchement de l'export");
      }

      const data = await res.json();
      return data.exportId; // ID du job d'export pour le polling
    } catch (err) {
      console.error("[useProject] exportVideo:", err);
      return null;
    }
  }, [project, projectId]);

  // Téléchargement du projet en JSON
  const downloadJSON = useCallback(() => {
    if (!project) return;

    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.nom.replace(/\s+/g, "-")}.videonova.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [project]);

  return {
    saveProject,
    exportVideo,
    downloadJSON,
    isSaving,
    saveError,
  };
}

// components/editor/VideoEditorClient.tsx — VideoNova Studio
// Composant client principal de l'éditeur vidéo

"use client";

import { useEffect, useCallback, useRef } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { VideoProject } from "@/types/project";
import PreviewPanel from "./PreviewPanel";
import Timeline from "./Timeline";
import MediaPanel from "./MediaPanel";
import PropertiesPanel from "./PropertiesPanel";
import EditorToolbar from "./EditorToolbar";
import ScenePanel from "./ScenePanel";

interface Props {
  project: any; // données brutes de la BDD
  mediaAssets: any[];
}

export default function VideoEditorClient({ project, mediaAssets }: Props) {
  const { loadProject, isDirty, project: editorProject, isSaving, setIsSaving, setIsDirty } = useEditorStore();
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Charger le projet dans le store au montage
  useEffect(() => {
    const projectData = project.jsonData as VideoProject;
    loadProject(projectData);
  }, [project.id]);

  // Sauvegarde automatique toutes les 30 secondes si modifié
  const saveProject = useCallback(async () => {
    const state = useEditorStore.getState();
    if (!state.project || !state.isDirty) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonData: state.project,
          duration: state.project.duration,
          name: state.project.name,
        }),
      });

      if (res.ok) {
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  }, [project.id]);

  // Autosave
  useEffect(() => {
    if (!isDirty) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(saveProject, 30000);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [isDirty, saveProject]);

  // Raccourcis clavier
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const store = useEditorStore.getState();
      // Ctrl+Z — Annuler
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        store.undo();
      }
      // Ctrl+Shift+Z ou Ctrl+Y — Rétablir
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        store.redo();
      }
      // Ctrl+S — Sauvegarder
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveProject();
      }
      // Espace — Lecture/Pause
      if (e.code === "Space" && !(e.target as HTMLElement).matches("input, textarea")) {
        e.preventDefault();
        store.setPlaying(!store.isPlaying);
      }
      // Suppr — Supprimer l'élément sélectionné
      if ((e.key === "Delete" || e.key === "Backspace") && !(e.target as HTMLElement).matches("input, textarea")) {
        const { selectedElementId, selectedSceneId } = store;
        if (selectedElementId && selectedSceneId) {
          store.deleteElement(selectedSceneId, selectedElementId);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveProject]);

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* ─── BARRE D'OUTILS ─────────────────────────────────────── */}
      <EditorToolbar projectId={project.id} onSave={saveProject} isSaving={isSaving} isDirty={isDirty} />

      {/* ─── ZONE PRINCIPALE ────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panneau gauche — Médias & Scènes */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden">
          <ScenePanel />
          <div className="flex-1 overflow-hidden">
            <MediaPanel mediaAssets={mediaAssets} projectId={project.id} />
          </div>
        </div>

        {/* Centre — Prévisualisation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PreviewPanel />
          <Timeline />
        </div>

        {/* Panneau droit — Propriétés */}
        <div className="w-72 bg-gray-900 border-l border-gray-800 overflow-y-auto">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

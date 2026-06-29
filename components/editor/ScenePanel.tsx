// components/editor/ScenePanel.tsx — VideoNova Studio
// Panneau de gestion des scènes

"use client";

import { useEditorStore } from "@/stores/editor-store";
import { Plus, Copy, Trash2, GripVertical } from "lucide-react";
import { randomUUID } from "crypto";

export default function ScenePanel() {
  const { project, selectedSceneId, selectScene, addScene, deleteScene, duplicateScene } = useEditorStore();

  if (!project) return null;

  function handleAddScene() {
    addScene({
      id: crypto.randomUUID(),
      order: project!.scenes.length,
      name: `Scène ${project!.scenes.length + 1}`,
      duration: 5,
      background: { type: "color", value: "#1a1a2e" },
      elements: [],
    });
  }

  return (
    <div className="border-b border-gray-800">
      <div className="p-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Scènes ({project.scenes.length})
        </h3>
        <button
          onClick={handleAddScene}
          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          title="Ajouter une scène"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-h-40 overflow-y-auto px-2 pb-2 space-y-1">
        {project.scenes.map((scene, index) => (
          <div
            key={scene.id}
            onClick={() => selectScene(scene.id)}
            className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer group transition-colors ${
              selectedSceneId === scene.id
                ? "bg-orange-500/10 border border-orange-500/20 text-orange-400"
                : "hover:bg-gray-800 text-gray-400 hover:text-white border border-transparent"
            }`}
          >
            <GripVertical className="w-3 h-3 opacity-30 shrink-0" />
            <span className="flex-1 text-xs truncate">{scene.name || `Scène ${index + 1}`}</span>
            <span className="text-xs opacity-50">{scene.duration}s</span>

            {/* Actions (visibles au hover) */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); duplicateScene(scene.id); }}
                className="p-0.5 hover:text-white"
                title="Dupliquer"
              >
                <Copy className="w-3 h-3" />
              </button>
              {project.scenes.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Supprimer cette scène ?")) deleteScene(scene.id);
                  }}
                  className="p-0.5 hover:text-red-400"
                  title="Supprimer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

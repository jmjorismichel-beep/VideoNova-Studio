// components/editor/EditorToolbar.tsx — VideoNova Studio
// Barre d'outils principale de l'éditeur

"use client";

import Link from "next/link";
import { useEditorStore } from "@/stores/editor-store";
import {
  ArrowLeft, Save, Undo2, Redo2, Download, Video,
  Loader2, CheckCircle, AlertCircle
} from "lucide-react";
import { useState } from "react";

interface Props {
  projectId: string;
  onSave: () => Promise<void>;
  isSaving: boolean;
  isDirty: boolean;
}

export default function EditorToolbar({ projectId, onSave, isSaving, isDirty }: Props) {
  const { project, undo, redo, undoStack, redoStack } = useEditorStore();
  const [exporting, setExporting] = useState(false);
  const [exportId, setExportId] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    try {
      // Sauvegarder d'abord
      await onSave();

      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, resolution: "1080p" }),
      });

      const data = await res.json();
      if (res.ok) {
        setExportId(data.exportJobId);
        // Ouvrir le panneau d'export
        window.open(`/export/${data.exportJobId}`, "_blank");
      } else {
        alert(data.error || "Erreur lors de l'export");
      }
    } catch {
      alert("Erreur lors de l'export");
    } finally {
      setExporting(false);
    }
  }

  async function handleDownloadJson() {
    window.open(`/api/projects/${projectId}/export-json`, "_blank");
  }

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-3 shrink-0">
      {/* Retour */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm mr-2"
        onClick={(e) => {
          if (isDirty && !confirm("Des modifications non sauvegardées seront perdues. Quitter ?")) {
            e.preventDefault();
          }
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Projets</span>
      </Link>

      {/* Logo */}
      <div className="flex items-center gap-1.5 mr-2">
        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-violet-600 rounded-md flex items-center justify-center">
          <Video className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-poppins font-semibold text-white text-sm hidden lg:block">VideoNova</span>
      </div>

      {/* Nom du projet */}
      <span className="text-gray-300 text-sm font-medium truncate max-w-[200px]">
        {project?.name || "Projet"}
      </span>

      {/* Statut sauvegarde */}
      <div className="flex items-center gap-1.5 text-xs ml-1">
        {isSaving ? (
          <><Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" /><span className="text-gray-400">Sauvegarde...</span></>
        ) : isDirty ? (
          <><AlertCircle className="w-3.5 h-3.5 text-orange-400" /><span className="text-orange-400">Non sauvegardé</span></>
        ) : (
          <><CheckCircle className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Sauvegardé</span></>
        )}
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Annuler / Rétablir */}
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Annuler (Ctrl+Z)"
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Rétablir (Ctrl+Y)"
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* Sauvegarder */}
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          title="Sauvegarder (Ctrl+S)"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Sauvegarder</span>
        </button>

        {/* Télécharger JSON */}
        <button
          onClick={handleDownloadJson}
          title="Télécharger le projet modifiable (.json)"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">.json</span>
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* Export MP4 */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="btn-primary flex items-center gap-2 py-2 text-sm"
        >
          {exporting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Export...</>
          ) : (
            <><Video className="w-4 h-4" /> Exporter MP4</>
          )}
        </button>
      </div>
    </header>
  );
}

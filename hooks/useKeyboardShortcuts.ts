// hooks/useKeyboardShortcuts.ts
// Raccourcis clavier globaux de l'éditeur

import { useEffect } from "react";
import { useEditorStore } from "@/stores/editor-store";

interface ShortcutOptions {
  onSave?: () => void;
  onExport?: () => void;
}

export function useKeyboardShortcuts({ onSave, onExport }: ShortcutOptions = {}) {
  const { undo, redo, setPlaying, isPlaying, deleteElement, selectedElementId, selectedSceneId } =
    useEditorStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignorer si focus dans un input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (ctrl && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
        e.preventDefault();
        redo();
      } else if (ctrl && e.key === "s") {
        e.preventDefault();
        onSave?.();
      } else if (ctrl && e.key === "e") {
        e.preventDefault();
        onExport?.();
      } else if (e.key === " ") {
        e.preventDefault();
        setPlaying(!isPlaying);
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId && selectedSceneId) {
        e.preventDefault();
        deleteElement(selectedSceneId, selectedElementId);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, onSave, onExport, setPlaying, isPlaying, deleteElement, selectedElementId, selectedSceneId]);
}

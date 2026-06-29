// hooks/useAutoSave.ts
// Hook pour la sauvegarde automatique toutes les 30 secondes

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/stores/editor-store";

const AUTOSAVE_INTERVAL_MS = 30_000; // 30 secondes

export function useAutoSave(
  projectId: string,
  onSave: () => Promise<void>
) {
  const { isDirty } = useEditorStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Lancer un timer si le projet a des changements non sauvegardés
    if (isDirty) {
      timerRef.current = setTimeout(async () => {
        await onSave();
      }, AUTOSAVE_INTERVAL_MS);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isDirty, onSave, projectId]);
}

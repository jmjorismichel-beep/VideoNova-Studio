// stores/editor-store.ts — VideoNova Studio
// Store Zustand global pour l'état de l'éditeur vidéo

import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import {
  EditorState,
  VideoProject,
  Scene,
  SceneElement,
  VideoFormat,
  VideoResolution,
} from "@/types/project";

// Limite de l'historique annuler/rétablir
const MAX_HISTORY = 30;

interface EditorActions {
  // ── Projet ──────────────────────────────
  loadProject: (project: VideoProject) => void;
  updateProject: (updates: Partial<VideoProject>) => void;
  setProjectName: (name: string) => void;
  resetProject: () => void;

  // ── Scènes ──────────────────────────────
  addScene: (scene: Scene) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  deleteScene: (sceneId: string) => void;
  duplicateScene: (sceneId: string) => void;
  reorderScenes: (scenes: Scene[]) => void;
  selectScene: (sceneId: string) => void;

  // ── Éléments ────────────────────────────
  addElement: (sceneId: string, element: SceneElement) => void;
  updateElement: (sceneId: string, elementId: string, updates: Partial<SceneElement>) => void;
  deleteElement: (sceneId: string, elementId: string) => void;
  selectElement: (elementId: string | null) => void;

  // ── Lecture ─────────────────────────────
  setCurrentTime: (time: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  setZoom: (zoom: number) => void;

  // ── Historique ──────────────────────────
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;

  // ── Sauvegarde ──────────────────────────
  setIsSaving: (saving: boolean) => void;
  setIsDirty: (dirty: boolean) => void;
}

type EditorStore = EditorState & EditorActions;

// ─────────────────────────────────────────
// ÉTAT INITIAL
// ─────────────────────────────────────────

const initialState: EditorState = {
  project: null,
  selectedElementId: null,
  selectedSceneId: null,
  currentTime: 0,
  isPlaying: false,
  zoom: 1,
  undoStack: [],
  redoStack: [],
  isSaving: false,
  isDirty: false,
};

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

function calcTotalDuration(scenes: Scene[]): number {
  return scenes.reduce((sum, s) => sum + s.duration, 0);
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ─────────────────────────────────────────
// STORE
// ─────────────────────────────────────────

export const useEditorStore = create<EditorStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // ─── Projet ───────────────────────────

      loadProject: (project) =>
        set({
          project: deepClone(project),
          selectedSceneId: project.scenes[0]?.id ?? null,
          selectedElementId: null,
          currentTime: 0,
          undoStack: [],
          redoStack: [],
          isDirty: false,
        }),

      updateProject: (updates) =>
        set((state) => {
          if (!state.project) return state;
          return {
            project: { ...state.project, ...updates, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        }),

      setProjectName: (name) =>
        set((state) => {
          if (!state.project) return state;
          return { project: { ...state.project, name }, isDirty: true };
        }),

      resetProject: () => set(initialState),

      // ─── Scènes ───────────────────────────

      addScene: (scene) => {
        get().saveSnapshot();
        set((state) => {
          if (!state.project) return state;
          const scenes = [...state.project.scenes, scene];
          return {
            project: {
              ...state.project,
              scenes,
              duration: calcTotalDuration(scenes),
              updatedAt: new Date().toISOString(),
            },
            selectedSceneId: scene.id,
            isDirty: true,
          };
        });
      },

      updateScene: (sceneId, updates) => {
        get().saveSnapshot();
        set((state) => {
          if (!state.project) return state;
          const scenes = state.project.scenes.map((s) =>
            s.id === sceneId ? { ...s, ...updates } : s
          );
          return {
            project: {
              ...state.project,
              scenes,
              duration: calcTotalDuration(scenes),
              updatedAt: new Date().toISOString(),
            },
            isDirty: true,
          };
        });
      },

      deleteScene: (sceneId) => {
        get().saveSnapshot();
        set((state) => {
          if (!state.project) return state;
          const scenes = state.project.scenes
            .filter((s) => s.id !== sceneId)
            .map((s, i) => ({ ...s, order: i }));
          const newSelected =
            state.selectedSceneId === sceneId
              ? (scenes[0]?.id ?? null)
              : state.selectedSceneId;
          return {
            project: {
              ...state.project,
              scenes,
              duration: calcTotalDuration(scenes),
              updatedAt: new Date().toISOString(),
            },
            selectedSceneId: newSelected,
            isDirty: true,
          };
        });
      },

      duplicateScene: (sceneId) => {
        get().saveSnapshot();
        set((state) => {
          if (!state.project) return state;
          const src = state.project.scenes.find((s) => s.id === sceneId);
          if (!src) return state;
          const clone = {
            ...deepClone(src),
            id: crypto.randomUUID(),
            name: `${src.name} (copie)`,
            order: src.order + 1,
          };
          const scenes = [
            ...state.project.scenes.slice(0, src.order + 1),
            clone,
            ...state.project.scenes.slice(src.order + 1),
          ].map((s, i) => ({ ...s, order: i }));
          return {
            project: {
              ...state.project,
              scenes,
              duration: calcTotalDuration(scenes),
              updatedAt: new Date().toISOString(),
            },
            selectedSceneId: clone.id,
            isDirty: true,
          };
        });
      },

      reorderScenes: (scenes) =>
        set((state) => {
          if (!state.project) return state;
          return {
            project: {
              ...state.project,
              scenes: scenes.map((s, i) => ({ ...s, order: i })),
              duration: calcTotalDuration(scenes),
              updatedAt: new Date().toISOString(),
            },
            isDirty: true,
          };
        }),

      selectScene: (sceneId) => set({ selectedSceneId: sceneId, selectedElementId: null }),

      // ─── Éléments ─────────────────────────

      addElement: (sceneId, element) => {
        get().saveSnapshot();
        set((state) => {
          if (!state.project) return state;
          const scenes = state.project.scenes.map((s) =>
            s.id === sceneId
              ? { ...s, elements: [...s.elements, element] }
              : s
          );
          return {
            project: { ...state.project, scenes, updatedAt: new Date().toISOString() },
            selectedElementId: element.id,
            isDirty: true,
          };
        });
      },

      updateElement: (sceneId, elementId, updates) =>
        set((state) => {
          if (!state.project) return state;
          const scenes = state.project.scenes.map((s) => {
            if (s.id !== sceneId) return s;
            return {
              ...s,
              elements: s.elements.map((el) =>
                el.id === elementId ? { ...el, ...updates } : el
              ),
            };
          });
          return {
            project: { ...state.project, scenes, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        }),

      deleteElement: (sceneId, elementId) => {
        get().saveSnapshot();
        set((state) => {
          if (!state.project) return state;
          const scenes = state.project.scenes.map((s) =>
            s.id === sceneId
              ? { ...s, elements: s.elements.filter((el) => el.id !== elementId) }
              : s
          );
          return {
            project: { ...state.project, scenes, updatedAt: new Date().toISOString() },
            selectedElementId: null,
            isDirty: true,
          };
        });
      },

      selectElement: (elementId) => set({ selectedElementId: elementId }),

      // ─── Lecture ──────────────────────────

      setCurrentTime: (time) => set({ currentTime: time }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(5, zoom)) }),

      // ─── Historique ───────────────────────

      saveSnapshot: () =>
        set((state) => {
          if (!state.project) return state;
          const snapshot = deepClone(state.project);
          const undoStack = [...state.undoStack, snapshot].slice(-MAX_HISTORY);
          return { undoStack, redoStack: [] };
        }),

      undo: () =>
        set((state) => {
          if (!state.project || state.undoStack.length === 0) return state;
          const undoStack = [...state.undoStack];
          const previous = undoStack.pop()!;
          return {
            project: previous,
            undoStack,
            redoStack: [deepClone(state.project), ...state.redoStack].slice(0, MAX_HISTORY),
            isDirty: true,
          };
        }),

      redo: () =>
        set((state) => {
          if (!state.project || state.redoStack.length === 0) return state;
          const redoStack = [...state.redoStack];
          const next = redoStack.shift()!;
          return {
            project: next,
            redoStack,
            undoStack: [...state.undoStack, deepClone(state.project)].slice(-MAX_HISTORY),
            isDirty: true,
          };
        }),

      // ─── Sauvegarde ───────────────────────

      setIsSaving: (saving) => set({ isSaving: saving }),
      setIsDirty: (dirty) => set({ isDirty: dirty }),
    })),
    { name: "VideoNova-Editor" }
  )
);

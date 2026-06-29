// components/editor/Timeline.tsx — VideoNova Studio
// Composant timeline multi-pistes

"use client";

import { useEditorStore } from "@/stores/editor-store";
import { useCallback, useRef } from "react";
import { Play, Pause, SkipBack, ZoomIn, ZoomOut } from "lucide-react";
import { SceneElement } from "@/types/project";

// Largeur en px par seconde de vidéo (avant zoom)
const BASE_PX_PER_SEC = 80;

// Couleurs par type d'élément
const ELEMENT_COLORS: Record<string, string> = {
  video:    "bg-blue-500/70 border-blue-400",
  image:    "bg-green-500/70 border-green-400",
  audio:    "bg-amber-500/70 border-amber-400",
  text:     "bg-violet-500/70 border-violet-400",
  logo:     "bg-pink-500/70 border-pink-400",
  subtitle: "bg-gray-500/70 border-gray-400",
  avatar:   "bg-teal-500/70 border-teal-400",
};

const TRACK_LABELS: Record<string, string> = {
  video: "Vidéo", image: "Image", audio: "Audio",
  text: "Texte", logo: "Logo", subtitle: "Sous-titres", avatar: "Avatar",
};

export default function Timeline() {
  const {
    project,
    selectedSceneId,
    selectedElementId,
    currentTime,
    isPlaying,
    zoom,
    setCurrentTime,
    setPlaying,
    setZoom,
    selectElement,
    updateElement,
  } = useEditorStore();

  const timelineRef = useRef<HTMLDivElement>(null);
  const pxPerSec = BASE_PX_PER_SEC * zoom;

  const scene = project?.scenes.find((s) => s.id === selectedSceneId);
  if (!scene) return null;

  const totalDuration = scene.duration;
  const totalWidth = Math.max(totalDuration * pxPerSec, 800);

  // Types d'éléments présents dans cette scène
  const elementTypes = [...new Set(scene.elements.map((el) => el.type))];
  const allTypes = ["video", "image", "audio", "text", "logo", "subtitle", "avatar"];
  const tracksToShow = allTypes.filter((t) => elementTypes.includes(t as any) || ["video", "audio", "text"].includes(t));

  // Cliquer sur la timeline pour déplacer la tête de lecture
  function handleTimelineClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.max(0, Math.min(totalDuration, x / pxPerSec));
    setCurrentTime(time);
  }

  // Formatage du temps
  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m}:${String(s).padStart(2, "0")}.${ms}`;
  }

  // Graduations de la règle
  const rulerMarks: number[] = [];
  const step = zoom < 0.5 ? 10 : zoom < 1 ? 5 : zoom < 2 ? 2 : 1;
  for (let t = 0; t <= totalDuration; t += step) rulerMarks.push(t);

  return (
    <div className="bg-gray-900 border-t border-gray-800 flex flex-col" style={{ height: "220px" }}>
      {/* ─── Contrôles de lecture ─────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800 shrink-0">
        <button
          onClick={() => setCurrentTime(0)}
          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          title="Retour au début"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => setPlaying(!isPlaying)}
          className="p-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          title={isPlaying ? "Pause (Espace)" : "Lecture (Espace)"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <span className="text-sm font-mono text-gray-300 min-w-[80px]">
          {formatTime(currentTime)}
        </span>
        <span className="text-xs text-gray-500">/ {formatTime(totalDuration)}</span>

        <div className="flex-1" />

        {/* Contrôles zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(zoom / 1.5)}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            title="Dézoomer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400 min-w-[36px] text-center">×{zoom.toFixed(1)}</span>
          <button
            onClick={() => setZoom(zoom * 1.5)}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            title="Zoomer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Zone timeline scrollable ─────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Labels des pistes */}
        <div className="w-24 shrink-0 border-r border-gray-800 flex flex-col">
          <div className="h-6 border-b border-gray-800" /> {/* hauteur règle */}
          {tracksToShow.map((type) => (
            <div key={type} className="h-12 flex items-center px-2 border-b border-gray-800/50">
              <span className="text-xs text-gray-500 truncate">{TRACK_LABELS[type]}</span>
            </div>
          ))}
        </div>

        {/* Timeline scrollable */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div
            ref={timelineRef}
            className="relative cursor-pointer"
            style={{ width: totalWidth + 40, minWidth: "100%" }}
            onClick={handleTimelineClick}
          >
            {/* ─── Règle graduée ─────────────────────────────── */}
            <div className="h-6 relative bg-gray-950/50 border-b border-gray-800">
              {rulerMarks.map((t) => (
                <div
                  key={t}
                  className="absolute top-0 h-full flex flex-col items-start"
                  style={{ left: t * pxPerSec }}
                >
                  <div className="w-px h-full bg-gray-700/50" />
                  <span
                    className="absolute top-1 text-[10px] text-gray-500 pl-1 whitespace-nowrap"
                    style={{ left: 1 }}
                  >
                    {formatTime(t)}
                  </span>
                </div>
              ))}
            </div>

            {/* ─── Pistes ────────────────────────────────────── */}
            {tracksToShow.map((trackType) => {
              const elements = scene.elements.filter((el) => el.type === trackType);
              return (
                <div
                  key={trackType}
                  className="h-12 relative border-b border-gray-800/50 bg-gray-900/30"
                >
                  {elements.map((el) => (
                    <TimelineItem
                      key={el.id}
                      element={el}
                      pxPerSec={pxPerSec}
                      isSelected={el.id === selectedElementId}
                      sceneDuration={totalDuration}
                      onSelect={() => selectElement(el.id)}
                      onUpdate={(updates) => updateElement(scene.id, el.id, updates as any)}
                    />
                  ))}
                </div>
              );
            })}

            {/* ─── Tête de lecture ───────────────────────────── */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-orange-500 pointer-events-none z-20"
              style={{ left: currentTime * pxPerSec }}
            >
              <div className="absolute -top-0 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ÉLÉMENT SUR LA TIMELINE ──────────────────────────────────

interface TimelineItemProps {
  element: SceneElement;
  pxPerSec: number;
  isSelected: boolean;
  sceneDuration: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<SceneElement>) => void;
}

function TimelineItem({ element, pxPerSec, isSelected, sceneDuration, onSelect, onUpdate }: TimelineItemProps) {
  const colorClass = ELEMENT_COLORS[element.type] || "bg-gray-500/70 border-gray-400";

  const left = element.startTime * pxPerSec;
  const width = Math.max(element.duration * pxPerSec, 20);

  const dragStartX = useRef<number | null>(null);
  const dragStartTime = useRef<number>(0);
  const resizingRight = useRef(false);

  // Glisser-déposer (déplacement)
  function handleMouseDown(e: React.MouseEvent) {
    if (resizingRight.current) return;
    e.stopPropagation();
    onSelect();
    dragStartX.current = e.clientX;
    dragStartTime.current = element.startTime;

    function onMouseMove(ev: MouseEvent) {
      if (dragStartX.current === null) return;
      const dx = ev.clientX - dragStartX.current;
      const dt = dx / pxPerSec;
      const newStart = Math.max(0, Math.min(sceneDuration - element.duration, dragStartTime.current + dt));
      onUpdate({ startTime: Math.round(newStart * 10) / 10 });
    }
    function onMouseUp() {
      dragStartX.current = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  // Redimensionner par la droite
  function handleResizeRight(e: React.MouseEvent) {
    e.stopPropagation();
    resizingRight.current = true;
    const startX = e.clientX;
    const startDuration = element.duration;

    function onMouseMove(ev: MouseEvent) {
      const dx = ev.clientX - startX;
      const newDuration = Math.max(0.1, startDuration + dx / pxPerSec);
      onUpdate({ duration: Math.round(newDuration * 10) / 10 });
    }
    function onMouseUp() {
      resizingRight.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  const dragStartX2 = useRef<number | null>(null);

  return (
    <div
      className={`timeline-item ${colorClass} border-2 ${isSelected ? "border-orange-500 ring-1 ring-orange-500/30" : "border-transparent"}`}
      style={{ left, width, top: 4, bottom: 4 }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {/* Nom de l'élément */}
      <span className="absolute inset-0 flex items-center px-2 text-[11px] text-white font-medium truncate select-none pointer-events-none">
        {(element as any).content || (element as any).originalName || element.type}
      </span>

      {/* Poignée redimensionnement droite */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20"
        onMouseDown={handleResizeRight}
      />
    </div>
  );
}

// Fix TypeScript pour useRef dans fonctions nested
import { useRef } from "react";

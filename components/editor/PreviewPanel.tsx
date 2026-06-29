// components/editor/PreviewPanel.tsx — VideoNova Studio
// Zone de prévisualisation de la vidéo

"use client";

import { useEditorStore } from "@/stores/editor-store";
import { useEffect, useRef } from "react";

export default function PreviewPanel() {
  const { project, selectedSceneId, currentTime, isPlaying, setCurrentTime, setPlaying } = useEditorStore();
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const scene = project?.scenes.find((s) => s.id === selectedSceneId);

  // Dimensions selon le format
  const FORMAT_DIMS: Record<string, { w: number; h: number }> = {
    "16:9": { w: 16, h: 9 },
    "9:16": { w: 9, h: 16 },
    "1:1":  { w: 1, h: 1 },
  };
  const dims = FORMAT_DIMS[project?.format || "16:9"] || { w: 16, h: 9 };

  // Boucle de lecture
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = null;
      return;
    }

    function tick(now: number) {
      if (lastTickRef.current === null) {
        lastTickRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      const store = useEditorStore.getState();
      const sceneDuration = store.project?.scenes.find((s) => s.id === store.selectedSceneId)?.duration || 5;
      const newTime = store.currentTime + dt;

      if (newTime >= sceneDuration) {
        store.setCurrentTime(0);
        store.setPlaying(false);
      } else {
        store.setCurrentTime(newTime);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = null;
    };
  }, [isPlaying]);

  if (!scene || !project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <p className="text-gray-600 text-sm">Aucune scène sélectionnée</p>
      </div>
    );
  }

  // Style du fond de scène
  const bgStyle: React.CSSProperties = {};
  if (scene.background.type === "color") bgStyle.backgroundColor = scene.background.value;
  else if (scene.background.type === "image") {
    bgStyle.backgroundImage = `url(${scene.background.value})`;
    bgStyle.backgroundSize = "cover";
    bgStyle.backgroundPosition = "center";
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-950 relative overflow-hidden p-4">
      {/* Conteneur de prévisualisation */}
      <div
        className="relative shadow-2xl overflow-hidden"
        style={{
          aspectRatio: `${dims.w} / ${dims.h}`,
          maxHeight: "calc(100% - 16px)",
          maxWidth: "calc(100% - 16px)",
          ...bgStyle,
        }}
      >
        {/* Rendu des éléments visibles au currentTime */}
        {scene.elements
          .filter(
            (el) =>
              el.visible !== false &&
              currentTime >= el.startTime &&
              currentTime < el.startTime + el.duration
          )
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((el) => {
            const style: React.CSSProperties = {
              position: "absolute",
              left: `${el.position.x}%`,
              top: `${el.position.y}%`,
              width: `${el.dimension.width}%`,
              height: `${el.dimension.height}%`,
              opacity: el.opacity,
              zIndex: el.zIndex,
            };

            if (el.type === "video") {
              return (
                <video
                  key={el.id}
                  ref={(ref) => { if (ref) videoRefs.current[el.id] = ref; }}
                  src={el.src}
                  style={style}
                  className="object-cover w-full h-full"
                  muted={el.muted}
                  loop={el.loop}
                  autoPlay={isPlaying}
                />
              );
            }

            if (el.type === "image" || el.type === "logo") {
              return (
                <img
                  key={el.id}
                  src={el.src}
                  alt=""
                  style={{ ...style, objectFit: el.objectFit || "contain" }}
                  className="w-full h-full"
                  draggable={false}
                />
              );
            }

            if (el.type === "text" || el.type === "subtitle") {
              const textStyle = el.style;
              return (
                <div
                  key={el.id}
                  style={{
                    ...style,
                    fontFamily: textStyle?.fontFamily || "Inter",
                    fontSize: `${textStyle?.fontSize || 24}px`,
                    fontWeight: textStyle?.fontWeight || "normal",
                    color: textStyle?.color || "#ffffff",
                    backgroundColor: textStyle?.backgroundColor,
                    textAlign: textStyle?.textAlign || "center",
                    textShadow: textStyle?.textShadow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: textStyle?.textAlign === "left" ? "flex-start" : textStyle?.textAlign === "right" ? "flex-end" : "center",
                    padding: `${textStyle?.padding || 8}px`,
                    borderRadius: `${textStyle?.borderRadius || 0}px`,
                  }}
                >
                  {el.content}
                </div>
              );
            }

            return null;
          })}

        {/* Filigrane si plan gratuit (sera remplacé par FFmpeg à l'export) */}
        <div className="absolute bottom-2 right-2 text-white/30 text-xs font-bold pointer-events-none select-none">
          VideoNova Studio
        </div>
      </div>

      {/* Barre de progression en bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          setCurrentTime(pct * (scene.duration));
        }}
      >
        <div
          className="h-full bg-orange-500 transition-none"
          style={{ width: `${scene.duration > 0 ? (currentTime / scene.duration) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}

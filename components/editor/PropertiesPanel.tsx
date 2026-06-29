// components/editor/PropertiesPanel.tsx — VideoNova Studio
// Panneau des propriétés de l'élément sélectionné

"use client";

import { useEditorStore } from "@/stores/editor-store";
import { Type, Move, Clock, Sliders } from "lucide-react";

export default function PropertiesPanel() {
  const { project, selectedSceneId, selectedElementId, updateElement, updateScene } = useEditorStore();

  const scene = project?.scenes.find((s) => s.id === selectedSceneId);
  const element = scene?.elements.find((el) => el.id === selectedElementId);

  // ─── Aucun élément sélectionné — Propriétés de la scène ──

  if (!element) {
    if (!scene) return (
      <div className="p-4 text-gray-500 text-sm text-center pt-12">
        Sélectionnez une scène ou un élément
      </div>
    );

    return (
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Propriétés de la scène
        </h3>

        <div className="space-y-4">
          {/* Nom */}
          <Field label="Nom">
            <input
              type="text"
              value={scene.name}
              onChange={(e) => updateScene(scene.id, { name: e.target.value })}
              className="form-input text-sm py-2"
            />
          </Field>

          {/* Durée */}
          <Field label="Durée (secondes)">
            <input
              type="number"
              min={1}
              max={300}
              step={0.5}
              value={scene.duration}
              onChange={(e) => updateScene(scene.id, { duration: parseFloat(e.target.value) || 5 })}
              className="form-input text-sm py-2"
            />
          </Field>

          {/* Fond */}
          <Field label="Fond">
            <div className="flex gap-2">
              <select
                value={scene.background.type}
                onChange={(e) => updateScene(scene.id, { background: { ...scene.background, type: e.target.value as any } })}
                className="form-input text-sm py-2 flex-1"
              >
                <option value="color">Couleur</option>
                <option value="image">Image</option>
                <option value="gradient">Dégradé</option>
              </select>
              {scene.background.type === "color" && (
                <input
                  type="color"
                  value={scene.background.value}
                  onChange={(e) => updateScene(scene.id, { background: { ...scene.background, value: e.target.value } })}
                  className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-gray-700"
                />
              )}
            </div>
          </Field>

          {/* Transition */}
          <Field label="Transition">
            <select
              value={scene.transition?.type || "none"}
              onChange={(e) =>
                updateScene(scene.id, { transition: { type: e.target.value as any, duration: scene.transition?.duration || 0.5 } })
              }
              className="form-input text-sm py-2"
            >
              <option value="none">Aucune</option>
              <option value="fade">Fondu</option>
              <option value="slide-left">Glissement gauche</option>
              <option value="slide-right">Glissement droite</option>
              <option value="zoom">Zoom</option>
              <option value="dissolve">Dissolution</option>
            </select>
          </Field>
        </div>
      </div>
    );
  }

  // ─── Propriétés communes à tous les éléments ─────────────

  function updateEl(updates: any) {
    updateElement(scene!.id, element!.id, updates);
  }

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
        Propriétés
      </h3>
      <p className="text-xs text-orange-400 mb-4 capitalize">{element.type}</p>

      <div className="space-y-5">
        {/* ─── Position & Taille ─────────── */}
        <Section title="Position & Taille" icon={Move}>
          <div className="grid grid-cols-2 gap-2">
            <Field label="X (%)">
              <NumInput value={element.position.x} onChange={(v) => updateEl({ position: { ...element.position, x: v } })} min={0} max={100} step={1} />
            </Field>
            <Field label="Y (%)">
              <NumInput value={element.position.y} onChange={(v) => updateEl({ position: { ...element.position, y: v } })} min={0} max={100} step={1} />
            </Field>
            <Field label="Largeur (%)">
              <NumInput value={element.dimension.width} onChange={(v) => updateEl({ dimension: { ...element.dimension, width: v } })} min={1} max={100} step={1} />
            </Field>
            <Field label="Hauteur (%)">
              <NumInput value={element.dimension.height} onChange={(v) => updateEl({ dimension: { ...element.dimension, height: v } })} min={1} max={100} step={1} />
            </Field>
          </div>
        </Section>

        {/* ─── Timing ────────────────────── */}
        <Section title="Timing" icon={Clock}>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Début (s)">
              <NumInput value={element.startTime} onChange={(v) => updateEl({ startTime: v })} min={0} step={0.1} />
            </Field>
            <Field label="Durée (s)">
              <NumInput value={element.duration} onChange={(v) => updateEl({ duration: v })} min={0.1} step={0.1} />
            </Field>
          </div>
        </Section>

        {/* ─── Opacité ───────────────────── */}
        <Section title="Apparence" icon={Sliders}>
          <Field label={`Opacité : ${Math.round(element.opacity * 100)}%`}>
            <input
              type="range"
              min={0} max={1} step={0.01}
              value={element.opacity}
              onChange={(e) => updateEl({ opacity: parseFloat(e.target.value) })}
              className="w-full accent-orange-500"
            />
          </Field>
          <Field label="Calque (z-index)">
            <NumInput value={element.zIndex} onChange={(v) => updateEl({ zIndex: v })} min={0} step={1} />
          </Field>
        </Section>

        {/* ─── Propriétés spécifiques texte ─ */}
        {(element.type === "text" || element.type === "subtitle") && (
          <Section title="Texte" icon={Type}>
            <Field label="Contenu">
              <textarea
                value={element.content}
                onChange={(e) => updateEl({ content: e.target.value })}
                rows={3}
                className="form-input text-sm py-2 resize-none"
              />
            </Field>
            <Field label="Taille police">
              <NumInput value={element.style?.fontSize || 24} onChange={(v) => updateEl({ style: { ...element.style, fontSize: v } })} min={8} max={200} step={1} />
            </Field>
            <Field label="Couleur">
              <input
                type="color"
                value={element.style?.color || "#ffffff"}
                onChange={(e) => updateEl({ style: { ...element.style, color: e.target.value } })}
                className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-gray-700"
              />
            </Field>
            <Field label="Alignement">
              <select
                value={element.style?.textAlign || "center"}
                onChange={(e) => updateEl({ style: { ...element.style, textAlign: e.target.value } })}
                className="form-input text-sm py-2"
              >
                <option value="left">Gauche</option>
                <option value="center">Centre</option>
                <option value="right">Droite</option>
              </select>
            </Field>
          </Section>
        )}

        {/* ─── Volume pour audio/vidéo ───── */}
        {(element.type === "audio" || element.type === "video") && (
          <Section title="Audio" icon={Sliders}>
            <Field label={`Volume : ${Math.round((element.volume || 1) * 100)}%`}>
              <input
                type="range"
                min={0} max={1} step={0.01}
                value={element.volume || 1}
                onChange={(e) => updateEl({ volume: parseFloat(e.target.value) })}
                className="w-full accent-orange-500"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={(element as any).muted || false}
                onChange={(e) => updateEl({ muted: e.target.checked })}
                className="rounded border-gray-600 bg-gray-800 text-orange-500"
              />
              Muet
            </label>
          </Section>
        )}
      </div>
    </div>
  );
}

// ─── SOUS-COMPOSANTS UI ──────────────────────────────────────

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs font-medium text-gray-400">{title}</span>
      </div>
      <div className="space-y-3 pl-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, min, max, step }: {
  value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      min={min} max={max} step={step || 1}
      className="form-input text-sm py-1.5"
    />
  );
}

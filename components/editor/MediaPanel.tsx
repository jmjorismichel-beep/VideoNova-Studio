// components/editor/MediaPanel.tsx — VideoNova Studio
// Panneau d'import et gestion des médias

"use client";

import { useState, useRef } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { Upload, Film, Image as ImageIcon, Music, FileText, Loader2, Plus, AlertCircle } from "lucide-react";
import { randomUUID } from "crypto";

interface Props {
  mediaAssets: any[];
  projectId: string;
}

const MEDIA_TABS = [
  { id: "video", label: "Vidéo", icon: Film, accept: "video/mp4,video/webm" },
  { id: "image", label: "Image", icon: ImageIcon, accept: "image/jpeg,image/png,image/webp" },
  { id: "audio", label: "Audio", icon: Music, accept: "audio/mpeg,audio/wav" },
  { id: "subtitle", label: "Sous-titres", icon: FileText, accept: ".srt" },
];

export default function MediaPanel({ mediaAssets: initial, projectId }: Props) {
  const [activeTab, setActiveTab] = useState("video");
  const [assets, setAssets] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { selectedSceneId, addElement } = useEditorStore();

  const tab = MEDIA_TABS.find((t) => t.id === activeTab)!;
  const filteredAssets = assets.filter((a) => a.type === activeTab.toUpperCase());

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError("");
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erreur lors de l'upload");
          continue;
        }

        setAssets((prev) => [...prev, data.asset]);
      }
    } catch {
      setError("Erreur lors de l'upload. Vérifiez votre connexion.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleAddToScene(asset: any) {
    if (!selectedSceneId) {
      alert("Sélectionnez d'abord une scène dans le panneau de gauche.");
      return;
    }

    const baseElement = {
      id: crypto.randomUUID(),
      position: { x: 10, y: 10 },
      dimension: { width: 80, height: 60 },
      startTime: 0,
      duration: 5,
      opacity: 1,
      zIndex: 1,
      visible: true,
    };

    if (asset.type === "VIDEO") {
      addElement(selectedSceneId, {
        ...baseElement,
        type: "video",
        src: asset.url,
        assetId: asset.id,
        volume: 1,
        muted: false,
        loop: false,
      });
    } else if (asset.type === "IMAGE" || asset.type === "LOGO") {
      addElement(selectedSceneId, {
        ...baseElement,
        type: "image",
        src: asset.url,
        assetId: asset.id,
        objectFit: "contain",
      });
    } else if (asset.type === "AUDIO") {
      addElement(selectedSceneId, {
        ...baseElement,
        type: "audio",
        position: { x: 0, y: 0 },
        dimension: { width: 100, height: 5 },
        src: asset.url,
        assetId: asset.id,
        volume: 1,
        muted: false,
        loop: false,
        zIndex: 0,
      });
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Médias</h3>

        {/* Tabs */}
        <div className="flex gap-1">
          {MEDIA_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === t.id
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone d'import */}
      <div className="p-3 border-b border-gray-800">
        <input
          ref={fileInputRef}
          type="file"
          accept={tab.accept}
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-700 hover:border-orange-500/50 rounded-xl p-4 text-center transition-colors group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Importation...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-gray-600 group-hover:text-orange-400 transition-colors" />
              <span className="text-xs text-gray-400 group-hover:text-orange-400 transition-colors">
                Importer {tab.label.toLowerCase()}
              </span>
            </div>
          )}
        </button>

        {error && (
          <div className="mt-2 flex items-start gap-1.5 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {error}
          </div>
        )}
      </div>

      {/* Liste des médias */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-8">
            <tab.icon className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-xs text-gray-600">
              Aucun(e) {tab.label.toLowerCase()} importé(e)
            </p>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <MediaAssetItem key={asset.id} asset={asset} onAddToScene={handleAddToScene} />
          ))
        )}
      </div>
    </div>
  );
}

// ─── ITEM DE MÉDIA ────────────────────────────────────────────

function MediaAssetItem({ asset, onAddToScene }: { asset: any; onAddToScene: (a: any) => void }) {
  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden group hover:bg-gray-800 transition-colors">
      {/* Aperçu */}
      {asset.type === "IMAGE" ? (
        <img src={asset.url} alt={asset.name} className="w-full h-20 object-cover" />
      ) : (
        <div className="w-full h-12 bg-gray-700/50 flex items-center justify-center">
          {asset.type === "VIDEO" ? (
            <Film className="w-5 h-5 text-gray-500" />
          ) : asset.type === "AUDIO" ? (
            <Music className="w-5 h-5 text-gray-500" />
          ) : (
            <FileText className="w-5 h-5 text-gray-500" />
          )}
        </div>
      )}

      {/* Infos + bouton */}
      <div className="p-2 flex items-center justify-between gap-2">
        <span className="text-xs text-gray-300 truncate flex-1" title={asset.originalName || asset.name}>
          {asset.originalName || asset.name}
        </span>
        <button
          onClick={() => onAddToScene(asset)}
          className="shrink-0 p-1 rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500/40 transition-colors"
          title="Ajouter à la scène"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

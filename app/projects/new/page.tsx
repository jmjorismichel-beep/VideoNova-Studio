"use client";

// app/projects/new/page.tsx
// Création d'un nouveau projet vidéo

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Monitor, Smartphone, Square, Zap } from "lucide-react";

type Format = "16:9" | "9:16" | "1:1";
type Resolution = "720p" | "1080p";

const FORMATS: { id: Format; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "16:9", label: "Horizontal", icon: <Monitor className="w-6 h-6" />, desc: "YouTube, présentation, cours" },
  { id: "9:16", label: "Vertical", icon: <Smartphone className="w-6 h-6" />, desc: "Instagram, TikTok, Reels" },
  { id: "1:1", label: "Carré", icon: <Square className="w-6 h-6" />, desc: "Facebook, LinkedIn" },
];

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [nom, setNom] = useState("Mon projet");
  const [format, setFormat] = useState<Format>("16:9");
  const [resolution, setResolution] = useState<Resolution>("720p");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!nom.trim()) {
      setError("Veuillez nommer votre projet.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nom.trim(), format, resolution, templateId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la création du projet.");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      router.push(`/editor/${data.id}`);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Nouveau projet</h1>
          <p className="text-gray-400">
            {templateId
              ? `Modèle sélectionné : ${templateId}`
              : "Configurez votre projet vidéo"}
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
          {/* Nom du projet */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Nom du projet
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="form-input"
              placeholder="Ex : Formation onboarding 2025"
              autoFocus
            />
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Format vidéo
            </label>
            <div className="grid grid-cols-3 gap-3">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    format === f.id
                      ? "border-nova-500 bg-nova-500/10 text-nova-400"
                      : "border-gray-700 hover:border-gray-600 text-gray-400"
                  }`}
                >
                  <div className="flex justify-center mb-2">{f.icon}</div>
                  <div className="font-semibold text-sm">{f.id}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{f.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Résolution */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Résolution d&apos;export
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setResolution("720p")}
                className={`p-4 rounded-xl border transition-all ${
                  resolution === "720p"
                    ? "border-nova-500 bg-nova-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="font-bold text-lg">720p</div>
                <div className="text-xs text-gray-500">HD — Plan gratuit</div>
              </button>
              <button
                onClick={() => setResolution("1080p")}
                className={`p-4 rounded-xl border transition-all ${
                  resolution === "1080p"
                    ? "border-nova-500 bg-nova-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="font-bold text-lg flex items-center gap-2">
                  1080p
                  <span className="text-xs bg-amber-500 text-black px-1.5 py-0.5 rounded font-medium">
                    Premium
                  </span>
                </div>
                <div className="text-xs text-gray-500">Full HD</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Création…
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Créer le projet
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <NewProjectForm />
    </Suspense>
  );
}

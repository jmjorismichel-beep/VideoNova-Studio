"use client";

// app/export/[id]/page.tsx
// Page de suivi de l'export vidéo en cours

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";

type ExportStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "EXPIRED";

interface ExportJob {
  id: string;
  status: ExportStatus;
  progress: number;
  outputUrl: string | null;
  errorMessage: string | null;
  project: { nom: string };
  createdAt: string;
}

export default function ExportStatusPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<ExportJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/export/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setJob(data);
        setIsLoading(false);

        // Arrêter le polling si terminé
        if (data.status === "COMPLETED" || data.status === "FAILED" || data.status === "EXPIRED") {
          clearInterval(interval);
        }
      } catch {
        setIsLoading(false);
      }
    };

    fetchStatus();
    interval = setInterval(fetchStatus, 3000); // Polling toutes les 3s

    return () => clearInterval(interval);
  }, [id]);

  const handleDownload = () => {
    if (job?.outputUrl) {
      window.open(job.outputUrl, "_blank");
    }
  };

  const StatusIcon = () => {
    if (!job) return null;
    switch (job.status) {
      case "COMPLETED":
        return <CheckCircle className="w-16 h-16 text-green-400" />;
      case "FAILED":
        return <XCircle className="w-16 h-16 text-red-400" />;
      default:
        return <Loader2 className="w-16 h-16 text-nova-400 animate-spin" />;
    }
  };

  const statusLabel: Record<ExportStatus, string> = {
    PENDING: "En attente de traitement…",
    PROCESSING: "Export en cours…",
    COMPLETED: "Export terminé !",
    FAILED: "Échec de l'export",
    EXPIRED: "Export expiré (24h dépassées)",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {isLoading ? (
          <Loader2 className="w-12 h-12 text-nova-400 animate-spin mx-auto" />
        ) : !job ? (
          <div>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Export introuvable</h1>
            <p className="text-gray-400 mb-6">Cet export n&apos;existe pas ou a été supprimé.</p>
            <button onClick={() => router.push("/dashboard")} className="btn-primary">
              Retour au tableau de bord
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex justify-center mb-6">
              <StatusIcon />
            </div>

            <h1 className="text-2xl font-bold mb-1">
              {statusLabel[job.status]}
            </h1>
            <p className="text-gray-400 mb-6">
              Projet : <span className="text-white font-medium">{job.project.nom}</span>
            </p>

            {/* Barre de progression */}
            {(job.status === "PENDING" || job.status === "PROCESSING") && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progression</span>
                  <span>{job.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-nova-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Cette page se met à jour automatiquement…
                </p>
              </div>
            )}

            {/* Message d'erreur */}
            {job.status === "FAILED" && job.errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-400 text-sm">{job.errorMessage}</p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex flex-col gap-3">
              {job.status === "COMPLETED" && (
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger la vidéo MP4
                </button>
              )}
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Tableau de bord
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

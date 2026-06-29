// services/export.service.ts
// Service de suivi de l'export vidéo

export interface ExportJob {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "EXPIRED";
  progress: number;
  outputPath: string | null;
  errorMessage: string | null;
}

// Déclenche un export et retourne l'ID du job
export async function triggerExport(projectId: string): Promise<string> {
  const res = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Impossible de démarrer l'export");
  }

  const data = await res.json();
  return data.exportId;
}

// Récupère le statut d'un export
export async function getExportStatus(exportId: string): Promise<ExportJob> {
  const res = await fetch(`/api/export/${exportId}`);
  if (!res.ok) throw new Error("Export introuvable");
  return res.json();
}

// Polling jusqu'à la fin de l'export (toutes les 3 secondes, timeout 10 minutes)
export async function waitForExport(
  exportId: string,
  onProgress?: (job: ExportJob) => void
): Promise<ExportJob> {
  const MAX_ATTEMPTS = 200; // 200 × 3s = 10 min
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = setInterval(async () => {
      try {
        attempts++;
        const job = await getExportStatus(exportId);
        onProgress?.(job);

        if (job.status === "COMPLETED" || job.status === "FAILED" || job.status === "EXPIRED") {
          clearInterval(poll);
          resolve(job);
        } else if (attempts >= MAX_ATTEMPTS) {
          clearInterval(poll);
          reject(new Error("Timeout : l'export prend trop de temps"));
        }
      } catch (err) {
        clearInterval(poll);
        reject(err);
      }
    }, 3000);
  });
}

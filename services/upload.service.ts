// services/upload.service.ts
// Service d'upload de fichiers vers l'API

export interface UploadResult {
  success: boolean;
  asset?: {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    type: string;
  };
  error?: string;
}

export async function uploadFile(
  file: File,
  projectId: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress?.(percent);
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ success: true, asset: data.asset });
        } else {
          resolve({ success: false, error: data.error || "Erreur d'upload" });
        }
      } catch {
        resolve({ success: false, error: "Réponse invalide du serveur" });
      }
    });

    xhr.addEventListener("error", () => {
      resolve({ success: false, error: "Erreur réseau lors de l'upload" });
    });

    xhr.addEventListener("abort", () => {
      resolve({ success: false, error: "Upload annulé" });
    });

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 o";
  const units = ["o", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export const ACCEPTED_MIME_TYPES: Record<string, string[]> = {
  video: ["video/mp4", "video/webm"],
  image: ["image/jpeg", "image/png", "image/webp"],
  audio: ["audio/mpeg", "audio/wav", "audio/mp3"],
  subtitle: ["text/plain", "application/x-subrip"],
};

export const ALL_ACCEPTED_TYPES = Object.values(ACCEPTED_MIME_TYPES).flat();

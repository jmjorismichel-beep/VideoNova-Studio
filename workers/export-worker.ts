// workers/export-worker.ts — VideoNova Studio
// Worker BullMQ qui traite les exports vidéo avec FFmpeg
// Lancer avec : tsx workers/export-worker.ts

import { Worker, Job } from "bullmq";
import { PrismaClient } from "@prisma/client";
import ffmpeg from "fluent-ffmpeg";
import { join } from "path";
import { mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import { VideoProject, Scene } from "../types/project";

const prisma = new PrismaClient();

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

// ─────────────────────────────────────────
// RÉSOLUTION → DIMENSIONS
// ─────────────────────────────────────────

const RESOLUTIONS: Record<string, { width: number; height: number }> = {
  "720p":  { width: 1280, height: 720  },
  "1080p": { width: 1920, height: 1080 },
};

const FORMAT_RATIO: Record<string, [number, number]> = {
  "16:9": [1920, 1080],
  "9:16": [1080, 1920],
  "1:1":  [1080, 1080],
};

// ─────────────────────────────────────────
// TRAITEMENT D'UN JOB D'EXPORT
// ─────────────────────────────────────────

async function processExportJob(job: Job) {
  const { exportJobId, projectId, userId, resolution, projectData, addWatermark } = job.data;

  console.log(`[Export Worker] Démarrage job ${exportJobId} — projet ${projectId}`);

  // Mettre à jour le statut en BDD
  await prisma.exportJob.update({
    where: { id: exportJobId },
    data: { status: "PROCESSING", startedAt: new Date(), progress: 5 },
  });

  const project = projectData as VideoProject;
  const outputDir = join(process.cwd(), "public", "exports", userId);
  await mkdir(outputDir, { recursive: true });

  const outputFilename = `${exportJobId}.mp4`;
  const outputPath = join(outputDir, outputFilename);
  const publicUrl = `/exports/${userId}/${outputFilename}`;

  try {
    await job.updateProgress(10);
    await prisma.exportJob.update({ where: { id: exportJobId }, data: { progress: 10 } });

    // ─── Générer le filtre complexe FFmpeg ──────────────────

    const dims = RESOLUTIONS[resolution] || RESOLUTIONS["720p"];
    const ratio = FORMAT_RATIO[project.format] || FORMAT_RATIO["16:9"];

    // Calculer les dimensions réelles selon le ratio
    let outWidth = dims.width;
    let outHeight = dims.height;
    if (project.format === "9:16") {
      outWidth = Math.round(dims.height * (9 / 16));
      outHeight = dims.height;
    } else if (project.format === "1:1") {
      outWidth = dims.height;
      outHeight = dims.height;
    }

    // Version simplifiée MVP : concaténer les vidéos des scènes
    // TODO Phase 2 : rendu complet avec overlays texte, images, animations

    const videoInputs: string[] = [];
    for (const scene of project.scenes) {
      for (const el of scene.elements) {
        if (el.type === "video") {
          const localPath = join(process.cwd(), "public", el.src);
          if (existsSync(localPath)) {
            videoInputs.push(localPath);
          }
        }
      }
    }

    await job.updateProgress(30);
    await prisma.exportJob.update({ where: { id: exportJobId }, data: { progress: 30 } });

    // ─── Commande FFmpeg ────────────────────────────────────

    await new Promise<void>((resolve, reject) => {
      let cmd = ffmpeg();

      if (videoInputs.length === 0) {
        // Pas de vidéo source — créer une vidéo couleur de test
        cmd = cmd.input(`color=${project.scenes[0]?.background?.value || "#1a1a2e"}:duration=${project.duration}:size=${outWidth}x${outHeight}:rate=30`).inputOptions(["-f", "lavfi"]);
      } else {
        videoInputs.forEach((input) => cmd.input(input));
      }

      cmd
        .outputOptions([
          "-c:v libx264",
          "-preset fast",
          "-crf 22",
          `-vf scale=${outWidth}:${outHeight}`,
          "-movflags faststart",
          "-an", // pas d'audio pour l'instant (MVP)
        ])
        .output(outputPath)
        .on("progress", async (progress) => {
          const pct = Math.min(90, 30 + Math.round((progress.percent || 0) * 0.6));
          await job.updateProgress(pct);
          await prisma.exportJob.update({ where: { id: exportJobId }, data: { progress: pct } });
        })
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });

    await job.updateProgress(95);

    // ─── Filigrane si plan gratuit ──────────────────────────

    if (addWatermark) {
      // TODO : ajouter un filigrane SVG/image avec FFmpeg drawtext ou overlay
      console.log("[Export Worker] Plan gratuit — filigrane à implémenter");
    }

    // ─── Finaliser ──────────────────────────────────────────

    await prisma.exportJob.update({
      where: { id: exportJobId },
      data: {
        status: "COMPLETED",
        progress: 100,
        outputUrl: publicUrl,
        completedAt: new Date(),
      },
    });

    console.log(`[Export Worker] Job ${exportJobId} terminé → ${publicUrl}`);

  } catch (error: any) {
    console.error(`[Export Worker] Erreur job ${exportJobId}:`, error);
    await prisma.exportJob.update({
      where: { id: exportJobId },
      data: {
        status: "FAILED",
        error: error.message || "Erreur inconnue",
      },
    });
    throw error; // BullMQ va réessayer selon la config
  }
}

// ─────────────────────────────────────────
// DÉMARRAGE DU WORKER
// ─────────────────────────────────────────

const worker = new Worker("video-export", processExportJob, {
  connection,
  concurrency: 2, // 2 exports simultanés max
});

worker.on("completed", (job) => {
  console.log(`[Export Worker] Job ${job.id} complété avec succès`);
});

worker.on("failed", (job, err) => {
  console.error(`[Export Worker] Job ${job?.id} échoué :`, err.message);
});

console.log("[Export Worker] Démarré — en attente de jobs...");

// Arrêt propre
process.on("SIGTERM", async () => {
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});

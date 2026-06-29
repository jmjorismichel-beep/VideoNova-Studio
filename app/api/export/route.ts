// app/api/export/route.ts — VideoNova Studio
// Déclenche un export vidéo MP4 via BullMQ

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { exportQueue } from "@/workers/export-queue";
import { z } from "zod";

const exportSchema = z.object({
  projectId: z.string(),
  resolution: z.enum(["720p", "1080p"]).default("1080p"),
  format: z.string().default("mp4"),
});

// ─── POST /api/export — Lancer un export ────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = exportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    const { projectId, resolution, format } = parsed.data;

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    // Vérifier le plan et les exports mensuels
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, exportsThisMonth: true },
    });
    const exportLimits = { FREE: 3, PREMIUM: 50, ENTERPRISE: 99999 };
    const maxExports = exportLimits[user?.plan || "FREE"];

    if ((user?.exportsThisMonth || 0) >= maxExports) {
      return NextResponse.json(
        {
          error: `Limite de ${maxExports} exports mensuels atteinte pour votre plan.`,
          upgradeRequired: user?.plan === "FREE",
        },
        { status: 403 }
      );
    }

    // Vérifier la résolution selon le plan
    if (resolution === "1080p" && user?.plan === "FREE") {
      return NextResponse.json(
        { error: "La résolution 1080p est réservée au plan Premium.", upgradeRequired: true },
        { status: 403 }
      );
    }

    // Créer le job d'export en base
    const exportJob = await prisma.exportJob.create({
      data: {
        userId: session.user.id,
        projectId,
        status: "PENDING",
        resolution,
        format,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expire dans 24h
      },
    });

    // Ajouter à la file BullMQ
    await exportQueue.add(
      "export-video",
      {
        exportJobId: exportJob.id,
        projectId,
        userId: session.user.id,
        resolution,
        format,
        projectData: project.jsonData,
        addWatermark: user?.plan === "FREE",
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      }
    );

    // Incrémenter le compteur d'exports
    await prisma.user.update({
      where: { id: session.user.id },
      data: { exportsThisMonth: { increment: 1 } },
    });

    // Log
    await prisma.usageLog.create({
      data: {
        userId: session.user.id,
        action: "export.start",
        details: { exportJobId: exportJob.id, projectId, resolution },
      },
    });

    return NextResponse.json(
      { success: true, exportJobId: exportJob.id, status: "PENDING" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/export:", error);
    return NextResponse.json({ error: "Erreur lors du démarrage de l'export" }, { status: 500 });
  }
}

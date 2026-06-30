// app/api/export/[id]/route.ts — VideoNova Studio
// Statut et téléchargement d'un export vidéo

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── GET /api/export/[id] — Statut de l'export ──────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const exportJob = await prisma.exportJob.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        status: true,
        progress: true,
        resolution: true,
        format: true,
        outputUrl: true,
        error: true,
        startedAt: true,
        completedAt: true,
        expiresAt: true,
        createdAt: true,
        userId: true,
      },
    });

    if (!exportJob) {
      return NextResponse.json({ error: "Export introuvable" }, { status: 404 });
    }
    if (exportJob.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Vérifier l'expiration
    if (exportJob.expiresAt && new Date() > exportJob.expiresAt) {
      return NextResponse.json(
        {
          ...exportJob,
          expired: true,
          outputUrl: null,
          message: "Le fichier exporté a expiré. Relancez l'export.",
        }
      );
    }

    return NextResponse.json({ ...exportJob, expired: false });
  } catch (error) {
    console.error("GET /api/export/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

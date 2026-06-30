// app/api/projects/[id]/export-json/route.ts — VideoNova Studio
// Téléchargement du projet au format JSON modifiable

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        scenes: true,
        subtitles: true,
        mediaAssets: {
          select: { id: true, type: true, name: true, originalName: true, url: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Construire le JSON d'export
    const exportData = {
      ...(project.jsonData as object),
      _export: {
        exportedAt: new Date().toISOString(),
        exportedBy: session.user.email,
        appVersion: "1.0",
        format: "VideoNova-Studio-Project",
      },
    };

    const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_${params.id}.videonova.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("export-json:", error);
    return NextResponse.json({ error: "Erreur lors de l'export" }, { status: 500 });
  }
}

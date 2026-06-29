// app/api/projects/import-json/route.ts — VideoNova Studio
// Import d'un projet depuis un fichier .videonova.json

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { VideoProject } from "@/types/project";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { jsonData } = body;

    // Validation minimale de la structure
    if (!jsonData || typeof jsonData !== "object") {
      return NextResponse.json({ error: "Données JSON invalides" }, { status: 400 });
    }

    if (!jsonData.name || !jsonData.scenes || !Array.isArray(jsonData.scenes)) {
      return NextResponse.json(
        { error: "Fichier projet invalide ou corrompu. Vérifiez qu'il s'agit bien d'un fichier VideoNova Studio." },
        { status: 400 }
      );
    }

    // Vérifier la version
    const supportedVersions = ["1.0"];
    if (jsonData.version && !supportedVersions.includes(jsonData.version)) {
      return NextResponse.json(
        { error: `Version de projet non supportée (${jsonData.version}). Version actuelle : 1.0` },
        { status: 400 }
      );
    }

    // Vérifier la limite de projets
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, _count: { select: { projects: true } } },
    });
    const limits = { FREE: 5, PREMIUM: 100, ENTERPRISE: 99999 };
    const maxProjects = limits[user?.plan || "FREE"];
    if ((user?._count.projects || 0) >= maxProjects) {
      return NextResponse.json(
        { error: `Limite de ${maxProjects} projets atteinte.` },
        { status: 403 }
      );
    }

    // Créer un nouveau projet avec un nouvel ID
    const newId = randomUUID();
    const importedProject: VideoProject = {
      ...jsonData,
      id: newId,
      meta: {
        ...jsonData.meta,
        authorId: session.user.id,
        importedFrom: jsonData.id,
        importedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    const project = await prisma.project.create({
      data: {
        id: newId,
        userId: session.user.id,
        name: `${jsonData.name} (importé)`,
        format: jsonData.format || "16:9",
        resolution: jsonData.resolution || "1080p",
        duration: jsonData.duration || 0,
        status: "DRAFT",
        jsonData: importedProject as any,
        version: jsonData.version || "1.0",
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("import-json:", error);
    return NextResponse.json({ error: "Erreur lors de l'import" }, { status: 500 });
  }
}

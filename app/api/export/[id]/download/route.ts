// app/api/export/[id]/download/route.ts
// Téléchargement d'une vidéo exportée

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { readFileSync, existsSync } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const exportJob = await prisma.exportJob.findUnique({
    where: { id: params.id },
  });

  if (!exportJob) {
    return NextResponse.json({ error: "Export introuvable" }, { status: 404 });
  }

  if (exportJob.userId !== session.user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (exportJob.status !== "COMPLETED" || !exportJob.outputPath) {
    return NextResponse.json({ error: "Export non disponible" }, { status: 400 });
  }

  // Vérifier expiration (24h)
  const ageMs = Date.now() - new Date(exportJob.createdAt).getTime();
  if (ageMs > 24 * 60 * 60 * 1000) {
    await prisma.exportJob.update({
      where: { id: params.id },
      data: { status: "EXPIRED" },
    });
    return NextResponse.json({ error: "Export expiré (24h dépassées)" }, { status: 410 });
  }

  // Construire le chemin du fichier
  const filePath = path.join(process.cwd(), "public", exportJob.outputPath.replace(/^\//, ""));

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  const fileBuffer = readFileSync(filePath);
  const filename = `export-${exportJob.projectId}.mp4`;

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(fileBuffer.length),
    },
  });
}

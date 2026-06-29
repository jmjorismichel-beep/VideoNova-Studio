// app/api/subtitles/import/route.ts
// Import d'un fichier de sous-titres SRT

import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface SRTEntry {
  index: number;
  startTime: number;  // en secondes
  endTime: number;    // en secondes
  text: string;
}

// Convertit "00:01:23,456" en secondes
function srtTimeToSeconds(time: string): number {
  const [hms, ms] = time.split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s + Number(ms) / 1000;
}

// Parse un fichier SRT en tableau d'entrées
function parseSRT(content: string): SRTEntry[] {
  const blocks = content.trim().split(/\n\s*\n/);
  const entries: SRTEntry[] = [];

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    const index = parseInt(lines[0], 10);
    const times = lines[1].split(" --> ");
    if (times.length !== 2) continue;

    const startTime = srtTimeToSeconds(times[0].trim());
    const endTime = srtTimeToSeconds(times[1].trim());
    const text = lines.slice(2).join("\n").trim();

    entries.push({ index, startTime, endTime, text });
  }

  return entries;
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;

  if (!file || !projectId) {
    return NextResponse.json({ error: "Fichier et projectId requis" }, { status: 400 });
  }

  // Vérifier que le projet appartient à l'utilisateur
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  // Vérifier le type de fichier
  if (!file.name.toLowerCase().endsWith(".srt")) {
    return NextResponse.json({ error: "Seuls les fichiers .srt sont acceptés" }, { status: 400 });
  }

  const content = await file.text();

  // Parser le SRT
  let entries: SRTEntry[];
  try {
    entries = parseSRT(content);
  } catch {
    return NextResponse.json({ error: "Fichier SRT invalide ou mal formé" }, { status: 400 });
  }

  if (entries.length === 0) {
    return NextResponse.json({ error: "Le fichier SRT ne contient aucun sous-titre" }, { status: 400 });
  }

  // Sauvegarder les sous-titres en base de données
  const created = await prisma.$transaction(
    entries.map((entry) =>
      prisma.subtitle.create({
        data: {
          projectId,
          index: entry.index,
          startTime: entry.startTime,
          endTime: entry.endTime,
          text: entry.text,
          language: "fr",
        },
      })
    )
  );

  return NextResponse.json({
    message: `${created.length} sous-titres importés avec succès`,
    count: created.length,
    subtitles: created,
  });
}

// app/api/projects/[id]/route.ts — VideoNova Studio
// Récupération, mise à jour et suppression d'un projet

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  jsonData: z.any().optional(),
  thumbnail: z.string().optional(),
  status: z.enum(["DRAFT", "READY", "ARCHIVED"]).optional(),
  isFavorite: z.boolean().optional(),
  duration: z.number().optional(),
});

// ─── Vérifier que le projet appartient à l'utilisateur ──────

async function getProjectOrForbid(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) return { project: null, error: "Projet introuvable", status: 404 };
  if (project.userId !== userId) return { project: null, error: "Accès refusé", status: 403 };

  return { project, error: null, status: 200 };
}

// ─── GET /api/projects/[id] ─────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { project, error, status } = await getProjectOrForbid(params.id, session.user.id);
    if (error) return NextResponse.json({ error }, { status });

    // Récupérer aussi les médias associés
    const mediaAssets = await prisma.mediaAsset.findMany({
      where: { projectId: params.id, userId: session.user.id },
    });

    return NextResponse.json({ project, mediaAssets });
  } catch (error) {
    console.error("GET /api/projects/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ─── PUT /api/projects/[id] — Sauvegarder ──────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { project: existing, error, status } = await getProjectOrForbid(params.id, session.user.id);
    if (error) return NextResponse.json({ error }, { status });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, jsonData, thumbnail, status: projectStatus, isFavorite, duration } = parsed.data;

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(jsonData !== undefined && { jsonData }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(projectStatus !== undefined && { status: projectStatus }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(duration !== undefined && { duration }),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("PUT /api/projects/[id]:", error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }
}

// ─── DELETE /api/projects/[id] ──────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { project, error, status } = await getProjectOrForbid(params.id, session.user.id);
    if (error) return NextResponse.json({ error }, { status });

    // Supprimer (en cascade via Prisma : scènes, sous-titres, jobs)
    await prisma.project.delete({ where: { id: params.id } });

    // Log
    await prisma.usageLog.create({
      data: {
        userId: session.user.id,
        action: "project.delete",
        details: { projectId: params.id },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id]:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}

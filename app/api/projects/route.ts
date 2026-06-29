// app/api/projects/route.ts — VideoNova Studio
// Liste et création des projets

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomUUID } from "crypto";
import { VideoProject, VideoFormat, VideoResolution } from "@/types/project";

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  format: z.enum(["16:9", "9:16", "1:1"]).default("16:9"),
  resolution: z.enum(["720p", "1080p"]).default("1080p"),
  templateId: z.string().optional(),
});

// ─── GET /api/projects — Liste des projets ───────────────

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const favorite = searchParams.get("favorite");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    const where: any = { userId: session.user.id };
    if (status) where.status = status.toUpperCase();
    if (favorite === "true") where.isFavorite = true;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          name: true,
          status: true,
          format: true,
          resolution: true,
          duration: true,
          thumbnail: true,
          isFavorite: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { exportJobs: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/projects:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ─── POST /api/projects — Créer un projet ─────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, format, resolution, templateId } = parsed.data;

    // Vérifier la limite de projets selon le plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, _count: { select: { projects: true } } },
    });

    const limits = { FREE: 5, PREMIUM: 100, ENTERPRISE: 99999 };
    const maxProjects = limits[user?.plan || "FREE"];
    if ((user?._count.projects || 0) >= maxProjects) {
      return NextResponse.json(
        { error: `Limite de ${maxProjects} projets atteinte pour votre plan. Passez au plan Premium pour continuer.` },
        { status: 403 }
      );
    }

    // Créer la structure JSON du projet
    const sceneId = randomUUID();
    const projectId = randomUUID();

    const jsonData: VideoProject = {
      id: projectId,
      version: "1.0",
      name,
      format: format as VideoFormat,
      resolution: resolution as VideoResolution,
      duration: 5,
      scenes: [
        {
          id: sceneId,
          order: 0,
          name: "Scène 1",
          duration: 5,
          background: { type: "color", value: "#1a1a2e" },
          elements: [],
          transition: { type: "fade", duration: 0.5 },
        },
      ],
      exportSettings: {
        format: format as VideoFormat,
        resolution: resolution as VideoResolution,
        fps: 30,
        quality: "high",
        codec: "h264",
        audioBitrate: "192k",
        addWatermark: user?.plan === "FREE",
      },
      meta: {
        author: session.user.name || session.user.email || "Utilisateur",
        authorId: session.user.id,
        language: "fr",
        templateId,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Sauvegarder en base
    const project = await prisma.project.create({
      data: {
        id: projectId,
        userId: session.user.id,
        name,
        format,
        resolution,
        duration: 5,
        status: "DRAFT",
        jsonData: jsonData as any,
        templateId: templateId || null,
        version: "1.0",
      },
    });

    // Log d'usage
    await prisma.usageLog.create({
      data: {
        userId: session.user.id,
        action: "project.create",
        details: { projectId: project.id, name, format, resolution },
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects:", error);
    return NextResponse.json({ error: "Erreur lors de la création du projet" }, { status: 500 });
  }
}

// app/api/templates/route.ts
// Route API pour la bibliothèque de modèles

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/templates
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const premium = searchParams.get("premium");

  try {
    const where: Record<string, unknown> = { isPublic: true };
    if (category) where.category = category;
    if (premium === "false") where.isPremium = false;

    const templates = await prisma.template.findMany({
      where,
      orderBy: [{ isPremium: "asc" }, { usageCount: "desc" }],
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        format: true,
        thumbnail: true,
        isPremium: true,
        usageCount: true,
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("[API/templates GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/templates — admin uniquement
export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  if ((session.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, category, format, jsonData, isPremium, thumbnail } = body;

    if (!name || !category || !format || !jsonData) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: { name, description: description || "", category, format, jsonData, isPremium: isPremium || false, thumbnail: thumbnail || null, isPublic: true },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("[API/templates POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

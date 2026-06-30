// app/api/upload/route.ts — VideoNova Studio
// Upload de fichiers médias (vidéo, image, audio, logo, sous-titres)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// Types de fichiers autorisés
const ALLOWED_TYPES: Record<string, string> = {
  // Vidéo
  "video/mp4": "video",
  "video/webm": "video",
  // Image
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  // Audio
  "audio/mpeg": "audio",
  "audio/mp3": "audio",
  "audio/wav": "audio",
  // Sous-titres
  "text/srt": "subtitle",
  "application/x-subrip": "subtitle",
};

// Extensions autorisées
const ALLOWED_EXTENSIONS = [
  ".mp4", ".webm",
  ".jpg", ".jpeg", ".png", ".webp",
  ".mp3", ".wav",
  ".srt",
];

// Taille max en octets (500 MB par défaut)
const MAX_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE_MB || "500") * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // Vérifier la taille
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux. Maximum : ${process.env.MAX_UPLOAD_SIZE_MB || 500} MB` },
        { status: 400 }
      );
    }

    // Vérifier le type MIME
    const mediaType = ALLOWED_TYPES[file.type];
    if (!mediaType) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Formats acceptés : MP4, WebM, JPG, PNG, WebP, MP3, WAV, SRT" },
        { status: 400 }
      );
    }

    // Vérifier l'extension
    const originalExt = extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
      return NextResponse.json(
        { error: "Extension de fichier non autorisée" },
        { status: 400 }
      );
    }

    // Nettoyer le nom du fichier (sécurité)
    const cleanName = file.name
      .replace(/[^a-zA-Z0-9.\-_]/g, "_")
      .replace(/_{2,}/g, "_")
      .substring(0, 100);

    // Générer un nom unique
    const uniqueName = `${randomUUID()}${originalExt}`;
    const uploadDir = join(process.cwd(), "public", "uploads", session.user.id);

    // Créer le dossier si nécessaire
    await mkdir(uploadDir, { recursive: true });

    // Écrire le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    // URL publique
    const publicUrl = `/uploads/${session.user.id}/${uniqueName}`;

    // Sauvegarder en base de données
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        userId: session.user.id,
        projectId: projectId || null,
        type: mediaType.toUpperCase() as any,
        name: uniqueName,
        originalName: cleanName,
        url: publicUrl,
        size: BigInt(file.size),
        mimeType: file.type,
      },
    });

    // Mettre à jour le stockage utilisé
    await prisma.user.update({
      where: { id: session.user.id },
      data: { storageUsed: { increment: BigInt(file.size) } },
    });

    return NextResponse.json({
      success: true,
      asset: {
        id: mediaAsset.id,
        name: mediaAsset.originalName,
        url: mediaAsset.url,
        type: mediaAsset.type,
        size: file.size,
        mimeType: file.type,
      },
    });
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

// app/api/ai/avatar/route.ts
// Génération de scène avatar IA (stub MVP — intégration Replicate/Runway à venir)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { texte, avatarStyle, position, fond } = await request.json();

  if (!texte) {
    return NextResponse.json({ error: "Un texte est requis" }, { status: 400 });
  }

  // TODO: Connecter Replicate, Runway ou D-ID pour l'avatar IA réel
  // Pour le MVP, on retourne une structure de scène simulée

  const sceneSimulee = {
    type: "avatar",
    avatarStyle: avatarStyle || "professionnel",
    position: position || "center",
    fond: fond || "#1e293b",
    texte,
    duree: Math.ceil(texte.split(" ").length / 3), // ~3 mots/seconde
    elements: [
      {
        type: "avatar",
        src: "/avatars/avatar-placeholder.png",
        animation: "idle",
        position: { x: 50, y: 50 },
      },
      {
        type: "subtitle",
        texte,
        style: { couleur: "#ffffff", taille: 18 },
      },
    ],
    note: "Avatar IA simulé — intégration complète disponible en Phase 6.",
  };

  return NextResponse.json(sceneSimulee);
}

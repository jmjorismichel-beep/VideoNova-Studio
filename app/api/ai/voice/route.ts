// app/api/ai/voice/route.ts
// Génération de voix off par IA (stub MVP — connecter ElevenLabs plus tard)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { texte, voix } = await request.json();

  if (!texte) {
    return NextResponse.json({ error: "Un texte est requis" }, { status: 400 });
  }

  // TODO: Connecter ElevenLabs ou Google TTS
  // const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
  // const audio = await elevenlabs.generate({ text: texte, voice: voix });

  return NextResponse.json({
    message: "Génération de voix off — disponible prochainement.",
    texte,
    voix: voix || "fr-FR-Standard-A",
    note: "Intégration ElevenLabs ou Google TTS à venir dans la Phase 5.",
  });
}

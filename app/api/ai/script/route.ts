// app/api/ai/script/route.ts
// Génération de script vidéo par IA (stub MVP — connecter OpenAI plus tard)

import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { theme, duree, style } = await request.json();

  if (!theme) {
    return NextResponse.json({ error: "Un thème est requis" }, { status: 400 });
  }

  // TODO: Connecter OpenAI GPT-4 pour générer un vrai script
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const response = await openai.chat.completions.create({ ... });

  // Réponse simulée pour le MVP
  const scriptSimule = {
    titre: `Script : ${theme}`,
    dureeEstimee: duree || "2 minutes",
    scenes: [
      {
        numero: 1,
        titre: "Introduction",
        duree: "15 secondes",
        texte: `Bienvenue dans cette vidéo sur : ${theme}. Dans les prochaines minutes, vous allez découvrir l'essentiel du sujet.`,
        elements: ["Titre animé", "Musique douce"],
      },
      {
        numero: 2,
        titre: "Développement",
        duree: "90 secondes",
        texte: `Voici les points clés à retenir sur ${theme}. Commençons par le contexte général, puis nous verrons les applications concrètes.`,
        elements: ["Texte sur fond", "Sous-titres"],
      },
      {
        numero: 3,
        titre: "Conclusion",
        duree: "15 secondes",
        texte: `Pour résumer, ${theme} est un sujet important. N'hésitez pas à nous contacter pour en savoir plus.`,
        elements: ["Call-to-action", "Logo"],
      },
    ],
    note: "Script généré automatiquement — fonctionnalité IA complète disponible prochainement.",
  };

  return NextResponse.json(scriptSimule);
}

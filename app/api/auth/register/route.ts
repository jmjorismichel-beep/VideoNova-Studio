// app/api/auth/register/route.ts — VideoNova Studio
// Création de compte utilisateur

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").max(50),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "Vous devez accepter les conditions générales d'utilisation",
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return NextResponse.json(
        { error: firstError.message, field: firstError.path[0] },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Vérifier si l'email existe déjà
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cette adresse email.", field: "email" },
        { status: 409 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        plan: "FREE",
      },
      select: { id: true, name: true, email: true, plan: true },
    });

    // Créer un abonnement gratuit par défaut
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "FREE",
        status: "active",
      },
    });

    // Log
    await prisma.usageLog.create({
      data: {
        userId: user.id,
        action: "user.register",
        details: { email },
      },
    });

    return NextResponse.json(
      { success: true, message: "Compte créé avec succès. Vous pouvez maintenant vous connecter.", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/register:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

// prisma/seed.ts
// Données initiales : comptes de test + modèles vidéo

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  // --- Comptes de test ---
  const hashedAdmin = await bcrypt.hash("Admin1234!", 12);
  const hashedPremium = await bcrypt.hash("Premium1234!", 12);
  const hashedUser = await bcrypt.hash("User1234!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@videonova.fr" },
    update: {},
    create: {
      name: "Admin VideoNova",
      email: "admin@videonova.fr",
      password: hashedAdmin,
      role: "ADMIN",
      plan: "ENTERPRISE",
      subscription: {
        create: {
          plan: "ENTERPRISE",
          status: "active",
        },
      },
    },
  });

  const premiumUser = await prisma.user.upsert({
    where: { email: "premium@videonova.fr" },
    update: {},
    create: {
      name: "Utilisateur Premium",
      email: "premium@videonova.fr",
      password: hashedPremium,
      role: "USER",
      plan: "PREMIUM",
      subscription: {
        create: {
          plan: "PREMIUM",
          status: "active",
        },
      },
    },
  });

  const freeUser = await prisma.user.upsert({
    where: { email: "user@videonova.fr" },
    update: {},
    create: {
      name: "Utilisateur Gratuit",
      email: "user@videonova.fr",
      password: hashedUser,
      role: "USER",
      plan: "FREE",
      subscription: {
        create: {
          plan: "FREE",
          status: "active",
        },
      },
    },
  });

  console.log(`✅ Comptes créés : ${admin.email}, ${premiumUser.email}, ${freeUser.email}`);

  // --- Modèles vidéo ---
  const templates = [
    {
      name: "Formation professionnelle",
      description: "Vidéo structurée pour présenter un cours ou une formation.",
      category: "Formation",
      format: "16:9",
      isPremium: false,
      isPublic: true,
      jsonData: {
        scenes: [
          { titre: "Introduction", duree: 10, fond: { type: "color", valeur: "#1e3a5f" } },
          { titre: "Objectifs", duree: 20, fond: { type: "color", valeur: "#0f2744" } },
          { titre: "Contenu", duree: 60, fond: { type: "color", valeur: "#1a2f4a" } },
          { titre: "Exercice", duree: 30, fond: { type: "color", valeur: "#0d1f33" } },
          { titre: "Conclusion", duree: 15, fond: { type: "color", valeur: "#1e3a5f" } },
        ],
      },
    },
    {
      name: "Tutoriel pas à pas",
      description: "Expliquez un processus étape par étape.",
      category: "Tutoriel",
      format: "16:9",
      isPremium: false,
      isPublic: true,
      jsonData: {
        scenes: [
          { titre: "Introduction", duree: 10, fond: { type: "color", valeur: "#14532d" } },
          { titre: "Étape 1", duree: 30, fond: { type: "color", valeur: "#166534" } },
          { titre: "Étape 2", duree: 30, fond: { type: "color", valeur: "#15803d" } },
          { titre: "Conclusion", duree: 15, fond: { type: "color", valeur: "#14532d" } },
        ],
      },
    },
    {
      name: "Réseaux sociaux vertical",
      description: "Format 9:16 pour Instagram Reels, TikTok.",
      category: "Social",
      format: "9:16",
      isPremium: false,
      isPublic: true,
      jsonData: {
        scenes: [
          { titre: "Accroche", duree: 3, fond: { type: "color", valeur: "#831843" } },
          { titre: "Message", duree: 12, fond: { type: "color", valeur: "#9d174d" } },
          { titre: "CTA", duree: 5, fond: { type: "color", valeur: "#831843" } },
        ],
      },
    },
    {
      name: "Avatar parlant IA",
      description: "Scène avec avatar IA présentant votre message.",
      category: "Avatar",
      format: "16:9",
      isPremium: true,
      isPublic: true,
      jsonData: {
        scenes: [
          { titre: "Intro avatar", duree: 15, fond: { type: "color", valeur: "#1c1917" } },
          { titre: "Message", duree: 60, fond: { type: "color", valeur: "#1c1917" } },
          { titre: "Conclusion", duree: 10, fond: { type: "color", valeur: "#1c1917" } },
        ],
      },
    },
    {
      name: "Message d'entreprise",
      description: "Communication officielle pour votre équipe ou clients.",
      category: "Professionnel",
      format: "16:9",
      isPremium: true,
      isPublic: true,
      jsonData: {
        scenes: [
          { titre: "Intro corporate", duree: 10, fond: { type: "color", valeur: "#0f172a" } },
          { titre: "Message principal", duree: 60, fond: { type: "color", valeur: "#1e293b" } },
          { titre: "Équipe", duree: 20, fond: { type: "color", valeur: "#0f172a" } },
          { titre: "Outro", duree: 10, fond: { type: "color", valeur: "#1e293b" } },
        ],
      },
    },
  ];

  for (const template of templates) {
    const existing = await prisma.template.findFirst({ where: { name: template.name } });
    if (!existing) {
      await prisma.template.create({ data: template });
    }
  }

  console.log(`✅ ${templates.length} modèles créés`);
  console.log("\n🎉 Seed terminé avec succès !");
  console.log("\nComptes disponibles :");
  console.log("  admin@videonova.fr     / Admin1234!");
  console.log("  premium@videonova.fr   / Premium1234!");
  console.log("  user@videonova.fr      / User1234!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

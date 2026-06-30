// app/dashboard/favorites/page.tsx
// Liste des projets favoris

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Star, Video } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const favorites = await prisma.project.findMany({
    where: { userId: session.user.id, isFavorite: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      format: true,
      thumbnail: true,
      updatedAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="ml-60 p-8">
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-6 h-6 text-orange-400" />
          <h1 className="text-2xl font-bold">Projets favoris</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Star className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Aucun favori pour l&apos;instant</p>
            <p className="text-sm text-gray-600">
              Marquez vos projets préférés depuis le tableau de bord.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-6 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-sm font-medium transition-colors"
            >
              Retour aux projets
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map((project) => (
              <Link
                key={project.id}
                href={`/editor/${project.id}`}
                className="project-card block group"
              >
                <div className="aspect-video bg-gray-900 relative overflow-hidden">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-700" />
                    </div>
                  )}
                  <Star className="absolute top-2 right-2 w-4 h-4 text-orange-400 fill-orange-400" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-white truncate text-sm">{project.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{project.format}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

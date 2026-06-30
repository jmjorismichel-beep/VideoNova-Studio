// app/dashboard/page.tsx — VideoNova Studio
// Tableau de bord utilisateur

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus, Upload, LayoutTemplate, Clock, Star,
  Video, MoreVertical, Edit2, Copy, Trash2, Download
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const [projects, user] = await Promise.all([
    prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        status: true,
        format: true,
        duration: true,
        thumbnail: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, plan: true, exportsThisMonth: true, storageUsed: true },
    }),
  ]);

  const drafts = projects.filter((p) => p.status === "DRAFT");
  const ready = projects.filter((p) => p.status === "READY");
  const favorites = projects.filter((p) => p.isFavorite);
  const recent = projects.slice(0, 6);

  const storageMb = Number(user?.storageUsed || 0) / (1024 * 1024);
  const maxStorageMb = user?.plan === "FREE" ? 500 : 10000;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ─── SIDEBAR ─────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-gray-900 border-r border-gray-800 flex flex-col z-40">
        <div className="p-5 border-b border-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="font-poppins font-bold text-white">VideoNova</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-orange-500/10 text-orange-400 font-medium text-sm">
            <Video className="w-4 h-4" /> Mes projets
          </Link>
          <Link href="/templates" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors">
            <LayoutTemplate className="w-4 h-4" /> Modèles
          </Link>
          <Link href="/dashboard/favorites" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors">
            <Star className="w-4 h-4" /> Favoris
          </Link>
        </nav>

        {/* Quota stockage */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-2">Stockage</div>
          <div className="h-1.5 bg-gray-700 rounded-full mb-1">
            <div
              className="h-1.5 bg-orange-500 rounded-full"
              style={{ width: `${Math.min(100, (storageMb / maxStorageMb) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {storageMb.toFixed(0)} Mo / {maxStorageMb} Mo
          </p>
          {user?.plan === "FREE" && (
            <Link href="/settings/subscription" className="mt-3 text-xs text-orange-400 hover:text-orange-300 block">
              Passer au Premium →
            </Link>
          )}
        </div>
      </aside>

      {/* ─── CONTENU PRINCIPAL ───────────────────────────────────── */}
      <div className="ml-60 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-poppins font-bold text-2xl text-white">
              Bonjour, {user?.name?.split(" ")[0] || "là"} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {projects.length} projet{projects.length !== 1 ? "s" : ""} • {user?.exportsThisMonth || 0} export{(user?.exportsThisMonth || 0) !== 1 ? "s" : ""} ce mois
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/projects/import" className="btn-secondary flex items-center gap-2 text-sm py-2.5">
              <Upload className="w-4 h-4" /> Importer
            </Link>
            <Link href="/projects/new" className="btn-primary flex items-center gap-2 text-sm py-2.5">
              <Plus className="w-4 h-4" /> Nouveau projet
            </Link>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <Link href="/projects/new" className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 hover:bg-orange-500/15 transition-colors group">
            <Plus className="w-8 h-8 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white mb-1">Créer de zéro</h3>
            <p className="text-xs text-gray-400">Commencer avec un projet vierge</p>
          </Link>
          <Link href="/templates" className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5 hover:bg-violet-500/15 transition-colors group">
            <LayoutTemplate className="w-8 h-8 text-violet-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white mb-1">Choisir un modèle</h3>
            <p className="text-xs text-gray-400">Partir d'une structure prête</p>
          </Link>
          <Link href="/projects/import-json" className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 hover:bg-blue-500/15 transition-colors group">
            <Upload className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white mb-1">Importer un projet</h3>
            <p className="text-xs text-gray-400">Ouvrir un fichier .videonova.json</p>
          </Link>
        </div>

        {/* Projets récents */}
        {recent.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" /> Projets récents
              </h2>
              {projects.length > 6 && (
                <Link href="/projects" className="text-sm text-orange-400 hover:text-orange-300">
                  Voir tout →
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        ) : (
          /* État vide */
          <div className="text-center py-24">
            <Video className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="font-semibold text-white text-xl mb-2">Aucun projet pour l'instant</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Créez votre première vidéo en quelques minutes !
            </p>
            <Link href="/projects/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Créer mon premier projet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPOSANT CARTE PROJET ──────────────────────────────────

function ProjectCard({ project }: { project: any }) {
  const duration = project.duration
    ? `${Math.floor(project.duration / 60)}:${String(Math.round(project.duration % 60)).padStart(2, "0")}`
    : "0:00";

  const updatedAgo = formatRelative(new Date(project.updatedAt));

  return (
    <Link href={`/editor/${project.id}`} className="project-card block group">
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-900 relative overflow-hidden">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Video className="w-10 h-10 text-gray-600" />
          </div>
        )}
        {/* Badge format */}
        <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
          {project.format}
        </span>
        {/* Badge durée */}
        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
          {duration}
        </span>
        {/* Badge favori */}
        {project.isFavorite && (
          <Star className="absolute top-2 right-2 w-4 h-4 text-yellow-400 fill-yellow-400" />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Edit2 className="w-3 h-3" /> Modifier
          </div>
        </div>
      </div>

      {/* Infos */}
      <div className="p-4">
        <h3 className="font-medium text-white truncate mb-1">{project.name}</h3>
        <p className="text-xs text-gray-500">{updatedAgo}</p>
      </div>
    </Link>
  );
}

// ─── HELPER DATE ─────────────────────────────────────────────

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  return date.toLocaleDateString("fr-FR");
}

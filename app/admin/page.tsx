// app/admin/page.tsx
// Tableau de bord administrateur

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Users, Folder, Download, AlertTriangle } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Statistiques globales
  const [totalUsers, totalProjects, totalExports, totalReports] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.exportJob.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, plan: true, role: true, createdAt: true },
  });

  const recentExports = await prisma.exportJob.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { project: { select: { name: true } }, user: { select: { email: true } } },
  });

  const stats = [
    { label: "Utilisateurs", value: totalUsers, icon: <Users className="w-5 h-5" />, color: "text-blue-400" },
    { label: "Projets", value: totalProjects, icon: <Folder className="w-5 h-5" />, color: "text-green-400" },
    { label: "Exports totaux", value: totalExports, icon: <Download className="w-5 h-5" />, color: "text-nova-400" },
    { label: "Signalements en attente", value: totalReports, icon: <AlertTriangle className="w-5 h-5" />, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Administration</h1>
          <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-medium">
            Accès administrateur
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Derniers utilisateurs */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold mb-4">Derniers inscrits</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left pb-2">Nom</th>
                    <th className="text-left pb-2">Plan</th>
                    <th className="text-left pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="py-2.5">
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          user.plan === "PREMIUM"
                            ? "bg-amber-500/10 text-amber-400"
                            : user.plan === "ENTERPRISE"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-gray-800 text-gray-400"
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Derniers exports */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold mb-4">Derniers exports</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left pb-2">Projet</th>
                    <th className="text-left pb-2">Statut</th>
                    <th className="text-left pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentExports.map((exp) => (
                    <tr key={exp.id}>
                      <td className="py-2.5">
                        <div className="font-medium text-white truncate max-w-[150px]">{exp.project.name}</div>
                        <div className="text-xs text-gray-500">{exp.user.email}</div>
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          exp.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-400"
                            : exp.status === "FAILED"
                            ? "bg-red-500/10 text-red-400"
                            : exp.status === "PROCESSING"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-gray-800 text-gray-400"
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-500 text-xs">
                        {new Date(exp.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

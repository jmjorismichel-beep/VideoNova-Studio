// app/editor/[id]/page.tsx — VideoNova Studio
// Page principale de l'éditeur vidéo

import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VideoEditorClient from "@/components/editor/VideoEditorClient";

export default async function EditorPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      mediaAssets: true,
      subtitles: { orderBy: { startTime: "asc" } },
    },
  });

  if (!project) notFound();
  if (project.userId !== session.user.id) redirect("/dashboard");

  return (
    <VideoEditorClient
      project={project}
      mediaAssets={project.mediaAssets}
    />
  );
}

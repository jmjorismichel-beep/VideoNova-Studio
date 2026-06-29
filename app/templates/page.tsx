"use client";

// app/templates/page.tsx
// Bibliothèque de modèles vidéo

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  Monitor,
  Smartphone,
  Square,
  Star,
  Zap,
} from "lucide-react";

const TEMPLATES = [
  {
    id: "formation-pro",
    titre: "Formation professionnelle",
    description: "Vidéo structurée pour présenter un cours ou une formation.",
    categorie: "Formation",
    duree: "2-5 min",
    format: "16:9",
    couleur: "from-blue-600 to-cyan-500",
    emoji: "🎓",
    scenes: 5,
    premium: false,
  },
  {
    id: "tutoriel",
    titre: "Tutoriel pas à pas",
    description: "Expliquez un processus étape par étape avec des captures.",
    categorie: "Tutoriel",
    duree: "3-8 min",
    format: "16:9",
    couleur: "from-green-600 to-emerald-500",
    emoji: "🔧",
    scenes: 6,
    premium: false,
  },
  {
    id: "reseaux-sociaux",
    titre: "Réseaux sociaux",
    description: "Format vertical optimisé pour Instagram, TikTok, Reels.",
    categorie: "Social",
    duree: "15-60 s",
    format: "9:16",
    couleur: "from-pink-600 to-rose-500",
    emoji: "📱",
    scenes: 3,
    premium: false,
  },
  {
    id: "presentation-cv",
    titre: "Présentation CV",
    description: "Vidéo de présentation professionnelle pour candidatures.",
    categorie: "Professionnel",
    duree: "1-2 min",
    format: "16:9",
    couleur: "from-purple-600 to-violet-500",
    emoji: "💼",
    scenes: 4,
    premium: false,
  },
  {
    id: "avatar-parlant",
    titre: "Avatar parlant",
    description: "Scène avec avatar IA présentant votre message.",
    categorie: "Avatar",
    duree: "1-3 min",
    format: "16:9",
    couleur: "from-orange-600 to-amber-500",
    emoji: "🤖",
    scenes: 3,
    premium: true,
  },
  {
    id: "annonce-evenement",
    titre: "Annonce événement",
    description: "Vidéo dynamique pour promouvoir un événement.",
    categorie: "Événement",
    duree: "30-60 s",
    format: "16:9",
    couleur: "from-red-600 to-orange-500",
    emoji: "🎉",
    scenes: 4,
    premium: false,
  },
  {
    id: "video-pedagogique",
    titre: "Vidéo pédagogique",
    description: "Contenu éducatif structuré avec exemples et exercices.",
    categorie: "Formation",
    duree: "5-10 min",
    format: "16:9",
    couleur: "from-teal-600 to-cyan-500",
    emoji: "📚",
    scenes: 8,
    premium: false,
  },
  {
    id: "promotionnel",
    titre: "Vidéo promotionnelle",
    description: "Présenter un produit ou service de façon attractive.",
    categorie: "Marketing",
    duree: "30-90 s",
    format: "16:9",
    couleur: "from-indigo-600 to-blue-500",
    emoji: "📣",
    scenes: 5,
    premium: true,
  },
  {
    id: "message-anniversaire",
    titre: "Message d'anniversaire",
    description: "Vidéo personnalisée pour fêter un anniversaire.",
    categorie: "Personnel",
    duree: "30-60 s",
    format: "1:1",
    couleur: "from-yellow-500 to-orange-400",
    emoji: "🎂",
    scenes: 3,
    premium: false,
  },
  {
    id: "message-entreprise",
    titre: "Message d'entreprise",
    description: "Communication officielle pour votre équipe ou clients.",
    categorie: "Professionnel",
    duree: "1-3 min",
    format: "16:9",
    couleur: "from-slate-600 to-gray-500",
    emoji: "🏢",
    scenes: 4,
    premium: true,
  },
];

const CATEGORIES = [
  "Tous",
  "Formation",
  "Tutoriel",
  "Social",
  "Professionnel",
  "Avatar",
  "Événement",
  "Marketing",
  "Personnel",
];

const FORMAT_ICONS: Record<string, React.ReactNode> = {
  "16:9": <Monitor className="w-3.5 h-3.5" />,
  "9:16": <Smartphone className="w-3.5 h-3.5" />,
  "1:1": <Square className="w-3.5 h-3.5" />,
};

export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Tous");

  const filtered = TEMPLATES.filter((t) => {
    const matchSearch =
      t.titre.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = categorie === "Tous" || t.categorie === categorie;
    return matchSearch && matchCat;
  });

  const handleUseTemplate = (templateId: string) => {
    // Redirige vers la création d'un nouveau projet avec ce modèle
    router.push(`/projects/new?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Bibliothèque de modèles</h1>
              <p className="text-gray-400 mt-1">
                Commencez rapidement avec un modèle prêt à personnaliser
              </p>
            </div>
            <button
              onClick={() => router.push("/projects/new")}
              className="btn-secondary"
            >
              Projet vierge
            </button>
          </div>

          {/* Recherche */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un modèle…"
              className="form-input pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtres catégories */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorie(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                categorie === cat
                  ? "bg-nova-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille de modèles */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Aucun modèle trouvé pour &quot;{search}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((template) => (
              <div
                key={template.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all group"
              >
                {/* Miniature */}
                <div
                  className={`h-36 bg-gradient-to-br ${template.couleur} flex items-center justify-center relative`}
                >
                  <span className="text-5xl">{template.emoji}</span>
                  {template.premium && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Premium
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 rounded px-2 py-0.5 text-xs text-white">
                    {FORMAT_ICONS[template.format]}
                    {template.format}
                  </div>
                </div>

                {/* Infos */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-white text-sm">
                      {template.titre}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.duree}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {template.scenes} scènes
                    </span>
                  </div>

                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="w-full btn-primary text-sm py-2"
                  >
                    Utiliser ce modèle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

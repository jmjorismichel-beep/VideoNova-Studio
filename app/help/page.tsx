"use client";

// app/help/page.tsx
// Page d'aide et FAQ

import { useState } from "react";
import { ChevronDown, Search, Mail, BookOpen, Video, Settings } from "lucide-react";

const FAQ = [
  {
    categorie: "Premiers pas",
    questions: [
      {
        q: "Comment créer mon premier projet vidéo ?",
        a: "Connectez-vous à votre compte, puis cliquez sur \"Nouveau projet\" dans votre tableau de bord. Choisissez un format (16:9, 9:16 ou 1:1), une résolution et donnez un nom à votre projet. L'éditeur s'ouvrira automatiquement.",
      },
      {
        q: "Quels formats de fichiers puis-je importer ?",
        a: "Vous pouvez importer des vidéos MP4 et WebM, des images JPG, PNG et WebP, des fichiers audio MP3 et WAV, ainsi que des sous-titres au format SRT.",
      },
      {
        q: "Comment sauvegarder mon projet ?",
        a: "Votre projet est sauvegardé automatiquement toutes les 30 secondes. Vous pouvez aussi sauvegarder manuellement avec le bouton \"Sauvegarder\" dans la barre d'outils de l'éditeur (ou Ctrl+S).",
      },
    ],
  },
  {
    categorie: "Export vidéo",
    questions: [
      {
        q: "Comment exporter ma vidéo en MP4 ?",
        a: "Dans l'éditeur, cliquez sur le bouton \"Exporter MP4\" dans la barre d'outils. L'export est traité côté serveur. Vous serez redirigé vers une page de suivi qui se met à jour en temps réel. Téléchargez votre vidéo une fois l'export terminé.",
      },
      {
        q: "Combien de temps dure un export ?",
        a: "Le temps d'export dépend de la longueur et de la complexité de votre vidéo. Une vidéo de 2 minutes prend généralement 1 à 3 minutes. Les vidéos longues ou complexes peuvent prendre plus de temps.",
      },
      {
        q: "Pourquoi y a-t-il un filigrane sur ma vidéo exportée ?",
        a: "Le filigrane VideoNova est présent sur toutes les exports du plan gratuit. Pour exporter sans filigrane, passez au plan Premium.",
      },
      {
        q: "Mes exports sont-ils supprimés automatiquement ?",
        a: "Oui, les fichiers vidéo exportés sont conservés 24 heures sur nos serveurs. Téléchargez votre vidéo rapidement après l'export. Le projet, lui, est conservé indéfiniment dans votre tableau de bord.",
      },
    ],
  },
  {
    categorie: "Projets et fichiers",
    questions: [
      {
        q: "Comment télécharger mon projet pour le modifier hors ligne ?",
        a: "Dans l'éditeur, cliquez sur l'icône de téléchargement dans la barre d'outils pour exporter votre projet au format .videonova.json. Ce fichier contient toute la structure de votre montage.",
      },
      {
        q: "Comment rouvrir un projet téléchargé en JSON ?",
        a: "Dans votre tableau de bord, cliquez sur \"Importer un projet JSON\". Sélectionnez votre fichier .videonova.json et le projet sera recréé dans votre tableau de bord.",
      },
      {
        q: "Puis-je dupliquer un projet ?",
        a: "Oui. Dans votre tableau de bord, survolez un projet et cliquez sur les trois points (...) pour accéder à l'option \"Dupliquer\".",
      },
    ],
  },
  {
    categorie: "Compte et abonnement",
    questions: [
      {
        q: "Quelle est la différence entre le plan Gratuit et Premium ?",
        a: "Le plan Gratuit offre 5 projets, 3 exports par mois, 500 Mo de stockage, la résolution 720p et un filigrane sur les exports. Le plan Premium (12€/mois) offre 100 projets, 50 exports, 10 Go de stockage, la résolution 1080p et aucun filigrane.",
      },
      {
        q: "Comment changer mon mot de passe ?",
        a: "Rendez-vous dans Paramètres > Sécurité. Saisissez votre mot de passe actuel, puis le nouveau mot de passe deux fois pour confirmer.",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const filteredFaq = FAQ.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="bg-gray-900/50 border-b border-gray-800 py-12 text-center px-4">
        <h1 className="text-3xl font-bold mb-3">Centre d&apos;aide</h1>
        <p className="text-gray-400 mb-6">Trouvez rapidement une réponse à vos questions</p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans l'aide…"
            className="form-input pl-10"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Liens rapides */}
        {!search && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <Video className="w-5 h-5" />, label: "Créer une vidéo", href: "/projects/new" },
              { icon: <BookOpen className="w-5 h-5" />, label: "Modèles", href: "/templates" },
              { icon: <Settings className="w-5 h-5" />, label: "Mon compte", href: "/settings" },
              { icon: <Mail className="w-5 h-5" />, label: "Contact", href: "mailto:support@videonova.fr" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-gray-600 transition-all group"
              >
                <div className="flex justify-center text-nova-400 mb-2 group-hover:text-nova-300">
                  {item.icon}
                </div>
                <span className="text-sm text-gray-300">{item.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* FAQ */}
        {filteredFaq.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            Aucun résultat pour &quot;{search}&quot;
          </p>
        ) : (
          <div className="space-y-8">
            {filteredFaq.map((cat) => (
              <div key={cat.categorie}>
                <h2 className="text-lg font-semibold mb-4 text-nova-400">
                  {cat.categorie}
                </h2>
                <div className="space-y-2">
                  {cat.questions.map((item, i) => {
                    const key = `${cat.categorie}-${i}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div
                        key={key}
                        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
                        >
                          <span className="font-medium text-sm pr-4">{item.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        <div className="mt-12 bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <h3 className="font-semibold mb-2">Vous n&apos;avez pas trouvé votre réponse ?</h3>
          <p className="text-gray-400 text-sm mb-4">
            Notre équipe est disponible pour vous aider.
          </p>
          <a
            href="mailto:support@videonova.fr"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contacter le support
          </a>
        </div>
      </div>
    </div>
  );
}

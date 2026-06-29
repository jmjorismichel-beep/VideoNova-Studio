// app/page.tsx — VideoNova Studio
// Page d'accueil

import Link from "next/link";
import {
  Play, Upload, LayoutTemplate, Zap, Shield, Users,
  Star, ChevronRight, CheckCircle, Video, Music, Type, Download
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* ─── NAVIGATION ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-poppins font-bold text-white text-lg">VideoNova</span>
            <span className="text-orange-500 font-semibold text-sm ml-0.5">Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Fonctionnalités</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Tarifs</Link>
            <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2">
              Se connecter
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm py-2 px-5">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-4 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-sm font-medium px-4 py-2 rounded-full border border-orange-500/20 mb-6">
            <Zap className="w-4 h-4" />
            Montage vidéo professionnel — 100% en ligne
          </span>

          <h1 className="font-poppins font-extrabold text-5xl sm:text-6xl md:text-7xl text-white leading-tight mb-6">
            Créez des vidéos
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-violet-400 bg-clip-text text-transparent">
              percutantes
            </span>
            <br />
            sans logiciel
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            VideoNova Studio est l'éditeur vidéo en ligne conçu pour les formateurs,
            associations et créateurs. Montez, exportez et partagez vos vidéos en quelques minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              <Play className="w-5 h-5 fill-current" />
              Créer ma première vidéo
            </Link>
            <Link href="/templates" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
              <LayoutTemplate className="w-5 h-5" />
              Voir les modèles
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Gratuit • Aucune carte bancaire requise • Aucun logiciel à installer
          </p>
        </div>

        {/* Preview de l'interface */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-700/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-gray-800 rounded-md h-6 mx-4" />
            </div>
            <div className="p-6 grid grid-cols-4 gap-4 min-h-[300px]">
              <div className="col-span-1 bg-gray-900/60 rounded-xl p-3 space-y-2">
                <div className="h-3 bg-gray-700 rounded w-3/4" />
                <div className="h-16 bg-orange-500/20 border border-orange-500/30 rounded-lg" />
                <div className="h-16 bg-violet-500/20 border border-violet-500/30 rounded-lg" />
                <div className="h-16 bg-blue-500/20 border border-blue-500/30 rounded-lg" />
              </div>
              <div className="col-span-2 flex flex-col gap-4">
                <div className="flex-1 bg-gray-900/60 rounded-xl flex items-center justify-center">
                  <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-orange-400" />
                  </div>
                </div>
                <div className="bg-gray-900/60 rounded-xl p-3 h-20">
                  <div className="h-2 bg-orange-500/40 rounded-full mb-2" />
                  <div className="h-6 bg-orange-500/20 rounded w-2/3" />
                  <div className="h-4 bg-blue-500/20 rounded mt-1 w-1/2" />
                </div>
              </div>
              <div className="col-span-1 bg-gray-900/60 rounded-xl p-3 space-y-2">
                <div className="h-3 bg-gray-700 rounded w-2/3" />
                <div className="space-y-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-2 bg-gray-700/50 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FONCTIONNALITÉS ─────────────────────────────────────── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl text-white mb-4">
              Tout ce qu'il vous faut pour créer
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Des outils professionnels accessibles à tous, même sans expérience en montage vidéo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TARIFS ──────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl text-white mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-gray-400">Commencez gratuitement, évoluez selon vos besoins.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Plan Gratuit */}
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-8">
              <h3 className="font-poppins font-bold text-2xl text-white mb-1">Gratuit</h3>
              <p className="text-gray-400 text-sm mb-6">Pour commencer</p>
              <div className="text-4xl font-bold text-white mb-8">0 €<span className="text-gray-400 text-lg font-normal">/mois</span></div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-secondary w-full text-center block">
                Commencer gratuitement
              </Link>
            </div>

            {/* Plan Premium */}
            <div className="bg-gradient-to-b from-orange-500/10 to-violet-500/10 border border-orange-500/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAIRE
              </div>
              <h3 className="font-poppins font-bold text-2xl text-white mb-1">Premium</h3>
              <p className="text-gray-400 text-sm mb-6">Pour les professionnels</p>
              <div className="text-4xl font-bold text-white mb-8">
                12 €<span className="text-gray-400 text-lg font-normal">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-primary w-full text-center block">
                Essayer 14 jours gratuits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-poppins font-bold text-4xl text-white mb-12 text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="bg-gray-800/40 border border-gray-700/40 rounded-xl group">
                <summary className="p-6 cursor-pointer font-medium text-white list-none flex items-center justify-between">
                  {item.q}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONFIANCE ───────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="font-poppins font-bold text-2xl text-white mb-3">Vos données vous appartiennent</h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            VideoNova Studio ne revend jamais vos données. Vos projets sont stockés de manière sécurisée
            et uniquement accessibles par vous. Vous pouvez supprimer votre compte et toutes vos données
            à tout moment.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-poppins font-bold text-white">VideoNova Studio</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/legal/cgu" className="hover:text-gray-300">CGU</Link>
            <Link href="/legal/privacy" className="hover:text-gray-300">Confidentialité</Link>
            <Link href="/help" className="hover:text-gray-300">Aide</Link>
          </div>
          <p className="text-gray-600 text-sm">© 2024 VideoNova Studio</p>
        </div>
      </footer>
    </main>
  );
}

// ─── DONNÉES ────────────────────────────────────────────────

const FEATURES = [
  { title: "Éditeur visuel intuitif", description: "Glissez-déposez vos médias sur une timeline simple. Pas besoin de formation.", icon: Play, color: "bg-orange-500/20 text-orange-400" },
  { title: "Import de médias", description: "Importez vos vidéos MP4, images, logos, musiques et sous-titres en quelques clics.", icon: Upload, color: "bg-blue-500/20 text-blue-400" },
  { title: "Modèles professionnels", description: "Démarrez rapidement avec nos modèles formation, tutoriel, réseaux sociaux et plus.", icon: LayoutTemplate, color: "bg-violet-500/20 text-violet-400" },
  { title: "Textes et titres", description: "Ajoutez des textes animés avec de nombreuses polices, couleurs et effets.", icon: Type, color: "bg-green-500/20 text-green-400" },
  { title: "Musique et voix", description: "Ajoutez une musique de fond, réglez les volumes et créez une ambiance sonore.", icon: Music, color: "bg-pink-500/20 text-pink-400" },
  { title: "Export MP4", description: "Exportez votre vidéo finale en MP4 HD, prête à être partagée partout.", icon: Download, color: "bg-amber-500/20 text-amber-400" },
];

const FREE_FEATURES = [
  "5 projets maximum",
  "Export MP4 en 720p",
  "3 exports par mois",
  "500 Mo de stockage",
  "Modèles de base",
  "Filigrane VideoNova",
];

const PREMIUM_FEATURES = [
  "Projets illimités",
  "Export MP4 en 1080p HD",
  "50 exports par mois",
  "10 Go de stockage",
  "Tous les modèles",
  "Sans filigrane",
  "Fonctions IA (bientôt)",
  "Sous-titres automatiques",
];

const FAQ = [
  {
    q: "Dois-je installer un logiciel ?",
    a: "Non. VideoNova Studio fonctionne entièrement dans votre navigateur. Aucune installation requise.",
  },
  {
    q: "Puis-je récupérer mon projet pour le modifier plus tard ?",
    a: "Oui. Vos projets sont sauvegardés automatiquement. Vous pouvez aussi télécharger le fichier projet (.videonova.json) et le réimporter n'importe quand.",
  },
  {
    q: "Quels formats de fichiers puis-je importer ?",
    a: "VideoNova Studio accepte les vidéos MP4 et WebM, les images JPG, PNG et WebP, les fichiers audio MP3 et WAV, et les sous-titres SRT.",
  },
  {
    q: "La vidéo exportée est-elle de bonne qualité ?",
    a: "Oui. Les exports sont en MP4 H.264. Le plan gratuit permet d'exporter en 720p, le plan Premium débloque la 1080p HD.",
  },
  {
    q: "Mes vidéos et données sont-elles confidentielles ?",
    a: "Absolument. Vos fichiers sont associés à votre compte uniquement. Aucun autre utilisateur ne peut y accéder. Vous pouvez supprimer vos données à tout moment.",
  },
];

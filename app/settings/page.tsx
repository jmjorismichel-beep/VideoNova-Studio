"use client";

// app/settings/page.tsx
// Paramètres du compte utilisateur

import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profil");
  const [nom, setNom] = useState(session?.user?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const handleSaveProfil = async () => {
    setIsSaving(true);
    // TODO: appel API PUT /api/user/profile
    await new Promise((r) => setTimeout(r, 800));
    setSavedMsg("Profil mis à jour !");
    setIsSaving(false);
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const TABS = [
    { id: "profil", label: "Profil", icon: <User className="w-4 h-4" /> },
    { id: "securite", label: "Sécurité", icon: <Lock className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "donnees", label: "Mes données", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Paramètres du compte</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-48 shrink-0">
            <ul className="space-y-1">
              {TABS.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeTab === tab.id
                        ? "bg-nova-600/20 text-nova-400 font-medium"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contenu */}
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6">
            {activeTab === "profil" && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Informations du profil</h2>
                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Adresse e-mail
                    </label>
                    <input
                      type="email"
                      value={session?.user?.email || ""}
                      disabled
                      className="form-input opacity-60 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      L&apos;e-mail ne peut pas être modifié pour le moment.
                    </p>
                  </div>
                  {savedMsg && (
                    <p className="text-green-400 text-sm">{savedMsg}</p>
                  )}
                  <button
                    onClick={handleSaveProfil}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? "Sauvegarde…" : "Enregistrer"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "securite" && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Sécurité</h2>
                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Mot de passe actuel
                    </label>
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Nouveau mot de passe
                    </label>
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                  <button className="btn-primary">Changer le mot de passe</button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { label: "Export vidéo terminé", desc: "Recevoir un e-mail quand un export est prêt" },
                    { label: "Nouvelles fonctionnalités", desc: "Être informé des mises à jour de la plateforme" },
                    { label: "Conseils et astuces", desc: "Recevoir des tutoriels et bonnes pratiques" },
                  ].map((notif) => (
                    <div key={notif.label} className="flex items-start justify-between py-3 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-white">{notif.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-700 peer-checked:bg-nova-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "donnees" && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Mes données</h2>
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-300 mb-3">
                      Vous pouvez exporter toutes vos données personnelles ou supprimer votre compte.
                    </p>
                    <button className="btn-secondary text-sm">
                      Exporter mes données
                    </button>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-red-400 mb-2">Zone dangereuse</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      La suppression de votre compte est irréversible. Tous vos projets et médias seront supprimés définitivement.
                    </p>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

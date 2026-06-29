"use client";

// app/settings/subscription/page.tsx
// Gestion de l'abonnement utilisateur

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Zap, ArrowLeft } from "lucide-react";

const PLANS = [
  {
    id: "FREE",
    label: "Gratuit",
    prix: "0 €",
    periode: "pour toujours",
    couleur: "border-gray-700",
    badge: null,
    features: [
      "5 projets maximum",
      "3 exports par mois",
      "500 Mo de stockage",
      "Export 720p HD",
      "Filigrane VideoNova sur les exports",
      "Accès à l'éditeur complet",
      "Sauvegarde JSON illimitée",
    ],
  },
  {
    id: "PREMIUM",
    label: "Premium",
    prix: "12 €",
    periode: "par mois",
    couleur: "border-nova-500",
    badge: "Recommandé",
    features: [
      "100 projets",
      "50 exports par mois",
      "10 Go de stockage",
      "Export 1080p Full HD",
      "Sans filigrane",
      "Accès aux modèles premium",
      "Accès prioritaire aux nouvelles fonctionnalités",
      "Support par e-mail",
    ],
  },
];

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const currentPlan = (session?.user as { plan?: string })?.plan || "FREE";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => router.push("/settings")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Paramètres
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Mon abonnement</h1>
          <p className="text-gray-400">
            Plan actuel :{" "}
            <span className="text-white font-semibold">{currentPlan}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gray-900 border-2 ${plan.couleur} rounded-2xl p-6 relative`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-nova-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">{plan.label}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.prix}</span>
                  <span className="text-gray-500 text-sm">{plan.periode}</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-nova-400 mt-0.5 shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {currentPlan === plan.id ? (
                <div className="w-full py-2.5 rounded-lg bg-gray-800 text-gray-400 text-sm text-center font-medium">
                  Plan actuel
                </div>
              ) : plan.id === "PREMIUM" ? (
                <button
                  className="w-full btn-primary flex items-center justify-center gap-2"
                  onClick={() => alert("Paiement Stripe — disponible prochainement !")}
                >
                  <Zap className="w-4 h-4" />
                  Passer au Premium
                </button>
              ) : (
                <button className="w-full btn-secondary text-sm">
                  Rétrograder
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          Le paiement Stripe sera disponible prochainement. Aucune carte bancaire requise pour le moment.
        </p>
      </div>
    </div>
  );
}

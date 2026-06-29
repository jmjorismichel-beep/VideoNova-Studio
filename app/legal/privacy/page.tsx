// app/legal/privacy/page.tsx
// Politique de confidentialité

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Politique de confidentialité</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : janvier 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Responsable du traitement</h2>
            <p>
              VideoNova Studio est responsable du traitement des données personnelles collectées via la
              plateforme. Pour toute question relative à la protection de vos données, contactez :
              <a href="mailto:privacy@videonova.fr" className="text-nova-400 hover:underline ml-1">
                privacy@videonova.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Données d&apos;identification : nom, adresse e-mail, mot de passe (haché)</li>
              <li>Données de navigation : adresse IP, type de navigateur, pages visitées</li>
              <li>Données de contenu : projets vidéo, médias importés, textes saisis</li>
              <li>Données d&apos;usage : nombre d&apos;exports, stockage utilisé, date de connexion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Fournir les services de montage vidéo</li>
              <li>Traiter les exports vidéo</li>
              <li>Améliorer la plateforme et corriger les bugs</li>
              <li>Vous informer des mises à jour importantes (avec votre consentement)</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Base légale</h2>
            <p>
              Le traitement de vos données repose sur l&apos;exécution du contrat (CGU) lors de votre
              inscription, votre consentement pour les communications marketing, et notre intérêt
              légitime pour la sécurité et l&apos;amélioration de la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Durée de conservation</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Données de compte : conservées jusqu&apos;à suppression du compte</li>
              <li>Projets et médias : conservés tant que le compte est actif</li>
              <li>Vidéos exportées : supprimées automatiquement après 24h</li>
              <li>Journaux d&apos;activité : conservés 12 mois</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Partage des données</h2>
            <p>
              Nous ne vendons pas vos données personnelles. Elles peuvent être partagées avec :
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Nos hébergeurs (serveurs situés en Europe)</li>
              <li>Stripe pour le traitement des paiements (plan Premium)</li>
              <li>Les autorités compétentes sur réquisition légale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong className="text-white">Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
              <li><strong className="text-white">Droit de rectification</strong> : corriger vos données</li>
              <li><strong className="text-white">Droit à l&apos;effacement</strong> : supprimer votre compte et vos données</li>
              <li><strong className="text-white">Droit à la portabilité</strong> : recevoir vos données dans un format standard</li>
              <li><strong className="text-white">Droit d&apos;opposition</strong> : vous opposer à certains traitements</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, rendez-vous dans Paramètres &gt; Mes données ou contactez-nous à{" "}
              <a href="mailto:privacy@videonova.fr" className="text-nova-400 hover:underline">
                privacy@videonova.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Cookies</h2>
            <p>
              La plateforme utilise uniquement des cookies strictement nécessaires au fonctionnement
              (session d&apos;authentification). Aucun cookie publicitaire ou de traçage tiers n&apos;est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Sécurité</h2>
            <p>
              Vos données sont protégées par des mesures techniques et organisationnelles adaptées :
              chiffrement des mots de passe (bcrypt), connexion HTTPS, accès restreint aux données,
              journalisation des accès et sauvegardes régulières.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact et réclamations</h2>
            <p>
              Pour toute question ou réclamation, contactez notre délégué à la protection des données à
              <a href="mailto:privacy@videonova.fr" className="text-nova-400 hover:underline ml-1">
                privacy@videonova.fr
              </a>. Vous pouvez également introduire une réclamation auprès de la CNIL (
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-nova-400 hover:underline">
                www.cnil.fr
              </a>).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// app/legal/cgu/page.tsx
// Conditions Générales d'Utilisation

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Conditions Générales d&apos;Utilisation</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : janvier 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Présentation de la plateforme</h2>
            <p>
              VideoNova Studio est une plateforme de montage vidéo en ligne accessible à l&apos;adresse
              videonova-studio.fr. Elle permet à ses utilisateurs de créer, modifier et exporter des vidéos
              directement depuis leur navigateur web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Acceptation des conditions</h2>
            <p>
              En accédant à la plateforme et en créant un compte, vous acceptez sans réserve les présentes
              Conditions Générales d&apos;Utilisation. Si vous n&apos;acceptez pas ces conditions, vous devez cesser
              d&apos;utiliser la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Création de compte</h2>
            <p>
              L&apos;accès aux fonctionnalités de la plateforme nécessite la création d&apos;un compte avec une adresse
              e-mail valide et un mot de passe sécurisé. Vous êtes responsable de la confidentialité de vos
              identifiants de connexion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Droits d&apos;auteur et propriété intellectuelle</h2>
            <p>
              <strong className="text-white">L&apos;utilisateur garantit être titulaire des droits</strong> sur
              l&apos;ensemble des contenus importés sur la plateforme (vidéos, images, musiques, voix, logos,
              textes). VideoNova Studio ne pourra être tenu responsable d&apos;une utilisation non autorisée de
              contenus protégés par des droits d&apos;auteur.
            </p>
            <p className="mt-3">
              Il est strictement interdit d&apos;importer des contenus :
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>protégés par des droits d&apos;auteur sans autorisation expresse du titulaire ;</li>
              <li>représentant une personne physique sans son consentement ;</li>
              <li>à caractère illicite, diffamatoire, obscène ou portant atteinte à la dignité humaine ;</li>
              <li>constituant des deepfakes non autorisés.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Contenu interdit</h2>
            <p>Il est interdit d&apos;utiliser la plateforme pour créer, stocker ou diffuser des contenus :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>à caractère pornographique ou pédopornographique ;</li>
              <li>incitant à la haine, à la violence ou à la discrimination ;</li>
              <li>faisant l&apos;apologie de crimes ou de terrorisme ;</li>
              <li>portant atteinte à la vie privée d&apos;autrui ;</li>
              <li>constituant du harcèlement, de la diffamation ou de la désinformation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Plans d&apos;abonnement</h2>
            <p>
              La plateforme propose un plan gratuit avec fonctionnalités limitées et un plan Premium avec
              accès complet. Les limites de chaque plan (nombre de projets, exports, résolution, stockage)
              sont décrites sur la page Tarifs. VideoNova Studio se réserve le droit de modifier ces limites
              avec un préavis de 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Conservation des données</h2>
            <p>
              Les vidéos exportées sont conservées sur nos serveurs pendant 24 heures à compter de la fin
              de l&apos;export. Passé ce délai, les fichiers sont supprimés automatiquement. Les projets et
              médias importés sont conservés aussi longtemps que votre compte est actif.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Limitation de responsabilité</h2>
            <p>
              VideoNova Studio ne saurait être tenu responsable des dommages directs ou indirects résultant
              de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser la plateforme, de la perte de données,
              d&apos;interruptions de service ou d&apos;erreurs dans les exports vidéo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Signalement</h2>
            <p>
              Tout contenu illicite ou portant atteinte aux droits d&apos;un tiers peut être signalé à l&apos;adresse
              <a href="mailto:signalement@videonova.fr" className="text-nova-400 hover:underline ml-1">
                signalement@videonova.fr
              </a>. Nous nous engageons à traiter les signalements dans les meilleurs délais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Modification des CGU</h2>
            <p>
              VideoNova Studio se réserve le droit de modifier les présentes conditions à tout moment.
              Les utilisateurs seront informés par e-mail en cas de modification substantielle. La poursuite
              de l&apos;utilisation de la plateforme vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français
              seront seuls compétents.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              Pour toute question relative aux présentes CGU, contactez-nous à{" "}
              <a href="mailto:legal@videonova.fr" className="text-nova-400 hover:underline">
                legal@videonova.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

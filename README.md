# 🎬 VideoNova Studio

**Plateforme SaaS de montage vidéo en ligne** — alternative professionnelle et originale aux outils de création vidéo en ligne.

---

## 📋 Présentation

VideoNova Studio permet de créer, modifier et exporter des vidéos directement dans le navigateur, sans installation. Conçu pour les formateurs, centres de formation, associations, enseignants et créateurs de contenu.

### Fonctionnalités MVP

- ✅ Authentification (inscription / connexion / JWT)
- ✅ Tableau de bord avec gestion des projets
- ✅ Éditeur vidéo avec timeline multi-pistes
- ✅ Import de médias (MP4, WebM, JPG, PNG, WebP, MP3, WAV, SRT)
- ✅ Ajout de texte, logo, musique, sous-titres
- ✅ Système de scènes avec transitions
- ✅ Sauvegarde automatique et manuelle
- ✅ Export / import du projet en JSON
- ✅ Export vidéo final en MP4 via FFmpeg
- ✅ Plans FREE / PREMIUM avec limites configurables

---

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| État global | Zustand |
| Glisser-déposer | DnD Kit |
| Backend | Next.js API Routes |
| Base de données | PostgreSQL + Prisma ORM |
| File d'attente | BullMQ + Redis |
| Rendu vidéo | FFmpeg (fluent-ffmpeg) |
| Auth | NextAuth v5 (Auth.js) |
| Validation | Zod |

---

## 🚀 Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- FFmpeg installé sur le système

### 1. Cloner le dépôt

```bash
git clone https://github.com/VOTRE_USERNAME/videonova-studio.git
cd videonova-studio
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Éditer `.env.local` avec vos valeurs :

```env
DATABASE_URL="postgresql://postgres:motdepasse@localhost:5432/videonova"
NEXTAUTH_SECRET="votre-secret-aleatoire-32-caracteres"
NEXTAUTH_URL="http://localhost:3000"
REDIS_URL="redis://localhost:6379"
```

### 4. Créer la base de données PostgreSQL

```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE videonova;"

# Lancer la migration Prisma
npm run db:migrate

# Générer le client Prisma
npm run db:generate

# Optionnel : insérer les données de test (modèles)
npm run db:seed
```

### 5. Lancer Redis

```bash
# Sur Linux/Mac
redis-server

# Sur Windows (via WSL ou Docker)
docker run -d -p 6379:6379 redis:7-alpine
```

### 6. Lancer le serveur de développement

```bash
# Terminal 1 : serveur Next.js
npm run dev

# Terminal 2 : worker d'export vidéo
npm run worker:export
```

L'application est disponible sur : **http://localhost:3000**

---

## 📁 Structure du projet

```
videonova-studio/
├── app/                          # Pages et routes Next.js (App Router)
│   ├── api/                      # Routes API
│   │   ├── auth/                 # NextAuth + inscription
│   │   ├── projects/             # CRUD projets + import/export JSON
│   │   ├── export/               # Déclenchement + statut export MP4
│   │   ├── upload/               # Import médias
│   │   └── templates/            # Bibliothèque de modèles
│   ├── auth/                     # Pages connexion / inscription
│   ├── dashboard/                # Tableau de bord utilisateur
│   ├── editor/[id]/              # Éditeur vidéo
│   ├── templates/                # Galerie de modèles
│   ├── export/[id]/              # Page de suivi d'export
│   ├── settings/                 # Paramètres + abonnement
│   ├── admin/                    # Administration
│   ├── legal/                    # CGU + Confidentialité
│   ├── help/                     # Aide et FAQ
│   ├── globals.css               # Styles globaux + classes utilitaires
│   ├── layout.tsx                # Layout racine
│   └── page.tsx                  # Page d'accueil
│
├── components/                   # Composants React réutilisables
│   └── editor/                   # Composants de l'éditeur vidéo
│       ├── VideoEditorClient.tsx # Orchestrateur principal
│       ├── EditorToolbar.tsx     # Barre d'outils
│       ├── Timeline.tsx          # Timeline multi-pistes
│       ├── PreviewPanel.tsx      # Zone de prévisualisation
│       ├── MediaPanel.tsx        # Panneau import médias
│       ├── ScenePanel.tsx        # Gestion des scènes
│       └── PropertiesPanel.tsx   # Propriétés de l'élément sélectionné
│
├── lib/                          # Utilitaires partagés
│   ├── auth.ts                   # Configuration NextAuth
│   ├── prisma.ts                 # Singleton Prisma client
│   └── crypto.ts                 # Hash / comparaison de mots de passe
│
├── stores/                       # Zustand stores
│   └── editor-store.ts           # État global de l'éditeur vidéo
│
├── types/                        # Types TypeScript
│   └── project.ts                # Types du projet vidéo (VideoProject, Scene, etc.)
│
├── workers/                      # Workers BullMQ
│   ├── export-queue.ts           # Définition de la queue
│   └── export-worker.ts          # Worker FFmpeg (processus séparé)
│
├── prisma/
│   ├── schema.prisma             # Schéma de base de données
│   └── seed.ts                   # Données initiales (modèles)
│
├── public/
│   ├── uploads/                  # Médias uploadés (ignoré par git)
│   ├── exports/                  # Vidéos exportées (ignoré par git)
│   └── example-project.videonova.json
│
├── .env.example                  # Variables d'environnement (modèle)
├── .gitignore
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔑 Comptes de test

Après la seed, vous pouvez utiliser ces comptes :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@videonova.fr | Admin1234! |
| Premium | premium@videonova.fr | Premium1234! |
| Free | user@videonova.fr | User1234! |

---

## 🎬 Export vidéo

L'export vidéo est géré par un **worker séparé** (BullMQ + FFmpeg).

**Il est obligatoire de lancer le worker** pour que les exports fonctionnent :

```bash
npm run worker:export
```

Le worker :
1. Attend les jobs dans la queue Redis `video-export`
2. Reconstruit les scènes avec FFmpeg
3. Met à jour le statut en base de données
4. Stocke le MP4 dans `public/exports/`

---

## 📦 Plans et limites

| Fonctionnalité | FREE | PREMIUM |
|----------------|------|---------|
| Projets max | 5 | 100 |
| Exports/mois | 3 | 50 |
| Stockage | 500 Mo | 10 Go |
| Résolution max | 720p | 1080p |
| Filigrane | ✅ Oui | ❌ Non |

---

## 🧪 Tests

```bash
# Tests unitaires (Vitest)
npm test

# Tests E2E (Playwright)
npm run test:e2e
```

---

## 🔒 Sécurité

- Validation MIME + extension + taille à l'upload
- Vérification d'ownership sur chaque route API
- Protection XSS (React + Next.js par défaut)
- Zod sur tous les inputs API
- Nettoyage des noms de fichiers (UUID + slugify)
- Séparation stricte des projets par utilisateur (RLS logiciel)

---

## 🗺️ Roadmap

| Phase | Statut | Description |
|-------|--------|-------------|
| MVP | ✅ En cours | Auth, dashboard, éditeur, import, export MP4 |
| Phase 2 | 📋 Prévu | Découpage clips, transitions, undo/redo amélioré |
| Phase 3 | 📋 Prévu | Galerie de modèles complète |
| Phase 4 | 📋 Prévu | Import SRT, éditeur sous-titres |
| Phase 5 | 📋 Prévu | IA : script, voix off, transcription |
| Phase 6 | 📋 Prévu | Avatar IA parlant |
| Phase 7 | 📋 Prévu | Stripe, plans, quotas, filigrane |
| Phase 8 | 📋 Prévu | Production, monitoring, S3 |

---

## 📄 Licence

Projet privé — tous droits réservés.

---

## 👤 Auteur

Développé avec [VideoNova Studio](http://localhost:3000)

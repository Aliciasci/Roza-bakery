# Roza Bakery — site web

Site vitrine et configurateur de gâteaux sur mesure.
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · aucune librairie d'animation.

```bash
npm install
cp .env.example .env.local   # facultatif en local
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Parcours principal

« Je compose mon gâteau → j'envoie ma demande → Roza Bakery confirme le prix et la disponibilité. »

`/composer` (9 étapes) → `/composer/recapitulatif` → `POST /api/commande` → `/composer/confirmation`

- Aucun prix n'est calculé ni affiché.
- Retrait uniquement sur place.
- Délai minimum de 3 jours, vérifié **dans le navigateur ET sur le serveur** (fuseau Europe/Paris), avec un conseil d'en prévoir 4.
- Le brouillon est sauvegardé dans le navigateur (`localStorage`). Les photos restent en mémoire.
- Le bouton « retour » du téléphone recule d'une étape (`?etape=N`).

## Administration — `/admin`

1. Dans `.env.local`, définir `ADMIN_PASSWORD=un-mot-de-passe-solide`, puis redémarrer le serveur.
2. Ouvrir `/admin` et se connecter. La session dure 7 jours. Changer le mot de passe déconnecte tout le monde.

| Section | Ce qu'on peut faire |
| --- | --- |
| **Tableau de bord** | Nouvelles demandes, retraits des 14 prochains jours, raccourcis |
| **Commandes** | Liste filtrable par statut, triable par date de retrait. Dans chaque fiche : composition, photos d'inspiration, contact (email / téléphone), statut, **prix confirmé**, notes internes |
| **Configurateur** | Pour chacune des 9 étapes : textes, choix unique ou multiple, étape obligatoire ou non. Ajouter, renommer, réordonner ou supprimer des **options** (crèmes, inserts, fruits…) et des groupes. Couleur (teinte ou couleur sur mesure), photo, option « champ libre », option **non disponible** (masquée sans la supprimer) |
| **Créations** | Galerie : photo, nom, description, catégories, format, ordre, badge « Exemple ». Gestion des catégories (filtres) |
| **FAQ** | Questions et réponses, ordre, réponses « à compléter » |
| **Boutique** | Coordonnées, Instagram, horaires, délais (minimum / conseillé), jours fermés, **dates indisponibles** (congés), créneaux de retrait, nombre maximum de photos |

Chaque modification est validée côté serveur, puis le site public est régénéré immédiatement.
Une barre « Modifications non enregistrées » évite de perdre une saisie.

**Stockage** : le contenu modifié est enregistré dans `data/content.json`, les photos dans `data/media/`.
Les fichiers `src/content/*` servent de valeurs par défaut. Pour revenir aux valeurs d'origine d'une section,
supprimer sa clé dans `data/content.json`. **Pensez à sauvegarder le dossier `data/`** : il contient les commandes,
les photos et le contenu.

**Sécurité** :
- toutes les routes `/admin` et `/api/admin` sont protégées par `src/proxy.ts` ;
- chaque action serveur revérifie la session ;
- cookie `httpOnly`, signé HMAC ;
- les photos jointes aux commandes ne sont accessibles qu'une fois connecté.

## Où modifier quoi ?

Depuis l'admin, sauf pour les textes éditoriaux ci-dessous. Valeurs par défaut :

| Besoin | Fichier |
| --- | --- |
| Adresse, email, Instagram, horaires, créneaux, jours fermés, délais | `src/content/site.ts` |
| Options du configurateur (ajouter / masquer / photo) | `src/content/configurator.ts` |
| Galerie « Nos créations » | `src/content/creations.ts` + photos dans `public/images/creations/` |
| FAQ | `src/content/faq.ts` |
| Textes « comment ça marche » / valeurs | `src/content/process.ts` |
| Histoire (À propos) | `src/app/a-propos/page.tsx` |
| Couleurs, typographies | `src/app/globals.css` (bloc `@theme`) |

### Informations à compléter (placeholders)

Aucune information sur Roza Bakery n'a été inventée — tout se complète depuis l'admin. Toute donnée manquante s'affiche comme
**`[… à compléter]`**, surlignée en rose :

- `site.ts` : ville, adresse, email, téléphone, Instagram, horaires (`null`). Les créneaux de retrait et les jours de fermeture sont à confirmer.
- `creations.ts` : 9 entrées d'exemple (badge « Exemple ») à remplacer par de vraies photos.
- `faq.ts` : réponses sur la modification de commande, le retrait et les ingrédients.
- `a-propos/page.tsx` : textes de l'histoire et portrait.
- Photos : tant qu'un champ `image` n'est pas renseigné, un emplacement « Photo Roza Bakery à venir » s'affiche.

## Architecture

```
src/
  proxy.ts                protection de /admin
  app/(site)/             pages publiques (avec header / footer)
  app/admin/              administration (connexion + (panel)/ : tableau de bord, commandes, éditeurs)
  app/media/[name]        photos publiées depuis l'admin
  app/                    API, SEO (sitemap, robots, OG, icônes)
    composer/             configurateur + récapitulatif + confirmation (provider partagé)
    api/commande          réception des demandes (multipart : JSON + photos)
    api/contact           formulaire de contact
  components/
    configurator/         Provider (état), étapes, cartes, calendrier, résumé, coupe SVG
    home/ layout/ ui/ creations/ seo/
  content/                contenu par défaut (avant toute modification dans l'admin)
  lib/
    data/                 couche d'accès aux données publiques (lit le contenu géré par l'admin)
    types.ts              modèle de données (options, créations, commandes, statuts)
    validation.ts dates.ts règles partagées client + serveur
  server/
    auth/                 session admin signée
    content/              stockage + validation (zod) du contenu modifiable
    media.ts              photos publiques
    orders/               schéma zod, service createOrder, OrderRepository
    notifications/        Mailer (Resend ou console) + gabarits d'emails
```

### Commandes et notifications

- **Stockage** : `FileOrderRepository` enregistre dans `data/orders/*.json` et `data/uploads/` (ignorés par git).
  Il faut donc un hébergement **avec disque persistant** (VPS, Railway, Render avec disque, Docker…).
  Sur une plateforme serverless (Vercel), le disque n'est pas persistant. Il faut alors remplacer 3 modules,
  sans toucher au reste du site :
  - `OrderRepository` → Postgres / Supabase ;
  - `server/content/store.ts` → base de données ;
  - `server/media.ts` → stockage objet.
- **Emails** : définissez `RESEND_API_KEY`, `EMAIL_FROM` et `BAKERY_NOTIFICATION_EMAIL`.
  - Roza Bakery reçoit la demande complète, photos en pièces jointes, avec « répondre à » réglé sur la cliente.
  - La cliente reçoit un accusé de réception.
  - Sans clé, les emails sont affichés dans la console du serveur.
- La demande n'est jamais perdue en silence : si elle ne peut être ni enregistrée ni transmise, l'API renvoie une erreur.


## SEO et accessibilité

- Métadonnées par page, Open Graph généré, `sitemap.xml`, `robots.txt`, favicon et icône Apple.
- Données structurées : JSON-LD `Bakery` (uniquement les champs connus) et `FAQPage`.
- Labels sur tous les champs, `aria-checked` / `role="radio|checkbox"` sur les cartes, navigation au clavier dans les cartes (flèches) et dans le calendrier.
- Focus visible, lien d'évitement, cibles tactiles d'au moins 44 px, champs en 16 px (pas de zoom sur iOS), zones de sécurité iPhone (`safe-area-inset`), `prefers-reduced-motion` respecté.

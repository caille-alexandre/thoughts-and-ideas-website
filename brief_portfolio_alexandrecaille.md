# Brief — alexandrecaille.fr

Portfolio personnel d'Alexandre Caillé, UI Designer spécialisé en design systems.

---

## Stack technique

- **Framework** : Next.js 14+ (App Router)
- **Style** : Tailwind CSS (pas de composants UI tiers)
- **Contenu** : fichiers `.md` / `.mdx` avec frontmatter YAML
- **Typographie** : Google Fonts — Oswald (titres) + Instrument Sans (corps)
- **Déploiement** : Docker container sur NAS Synology, derrière nginx reverse proxy

---

## Structure des pages

### Navigation — système de volets (split panels)

La navigation est un système de deux panneaux côte à côte :

- **Panneau gauche** : liste de navigation (About / Notes / Writing) + métadonnées de l'item sélectionné
- **Panneau droit** : contenu de l'item sélectionné

Comportement :
- La largeur des panneaux est redimensionnable par drag (la séparation est draggable)
- La largeur des panneaux est persistée dans `localStorage`
- Sur mobile : vue colonne unique, le panneau gauche devient un header/nav fixe
- Transition fluide à l'ouverture d'un item (pas de navigation full-page)

### Sections

**About**
- Page statique, contenu en MDX
- Présentation courte, liens sociaux, stack de compétences

**Notes**
- Liste de billets courts (pensées, observations, fragments)
- Format : titre optionnel + texte court + date
- Triés par date décroissante
- Frontmatter minimal :
  ```yaml
  ---
  title: "Titre optionnel"
  date: "2026-03-15"
  published: true
  ---
  ```

**Writing**
- Articles longs, structurés
- Frontmatter complet :
  ```yaml
  ---
  title: "Titre de l'article"
  date: "2026-03-15"
  description: "Résumé court"
  published: true
  ---
  ```

---

## Contenu

Les fichiers de contenu sont dans `/content/notes/` et `/content/writing/`.

**Important** : seuls les fichiers avec `published: true` dans le frontmatter sont affichés. Les fichiers sans ce champ ou avec `published: false` sont ignorés. Cela permet d'utiliser le dossier `/content/` comme un dossier partagé avec Obsidian (via symlink ou mount Docker) sans que les brouillons apparaissent sur le site.

---

## Design

### Palette — thème clair (défaut)

- **Background** : `#F5F0E8` (crème chaud)
- **Surface** : `#EDE8DF`
- **Texte principal** : `#1A1208`
- **Texte secondaire** : `#6B5E4A`
- **Accent** : `#C4603A` (terracotta)
- **Séparateurs** : `#D9D0C4`

### Palette — thème sombre

- **Background** : `#1C1410` (marron très foncé)
- **Surface** : `#261C16`
- **Texte principal** : `#F0EAE0`
- **Texte secondaire** : `#9C8878`
- **Accent** : `#D4704A` (terracotta légèrement éclairci pour le thème sombre)
- **Séparateurs** : `#3A2E26`

Le switcher de thème est discret — une icône ou un toggle minimal dans le coin de l'interface. Le thème est persisté dans `localStorage`.

### Typographie

```css
/* Titres, labels de navigation, dates */
font-family: 'Oswald', sans-serif;
font-weight: 400–600;

/* Corps de texte, paragraphes */
font-family: 'Instrument Sans', sans-serif;
font-weight: 400–500;
```

Hiérarchie typographique sobre — pas d'effets, pas de gradients sur le texte. La lisibilité prime.

### Ambiance générale

- Minimalisme éditorial — proche de floguo.com dans l'esprit
- Beaucoup d'espace blanc (ou d'espace crème)
- Pas d'animations spectaculaires — transitions douces et fonctionnelles
- Pas d'images dans un premier temps (portfolio text-first)
- Grain overlay très subtil en background (optionnel, à tester)

---

## Architecture des fichiers

```
/
├── app/
│   ├── layout.tsx          # Layout racine, import fonts, theme provider
│   ├── page.tsx            # Redirect vers /about ou layout principal
│   └── [...slug]/
│       └── page.tsx        # Route dynamique pour notes et writing
├── components/
│   ├── PanelLayout.tsx     # Le système de volets
│   ├── NavPanel.tsx        # Panneau gauche — liste + nav
│   ├── ContentPanel.tsx    # Panneau droit — rendu MDX
│   ├── ThemeToggle.tsx     # Switcher thème clair/sombre
│   └── MDXContent.tsx      # Renderer MDX avec styles
├── content/
│   ├── about.mdx           # Contenu About (statique)
│   ├── notes/              # Fichiers .md des notes
│   │   └── *.md
│   └── writing/            # Fichiers .md des articles
│       └── *.md
├── lib/
│   ├── content.ts          # Fonctions de lecture des fichiers MD (fs, gray-matter)
│   └── types.ts            # Types TypeScript (Post, Note, etc.)
├── styles/
│   └── globals.css         # Variables CSS thème, reset, typographie
└── docker-compose.yml      # Container Next.js pour le NAS
```

---

## docker-compose.yml (à générer)

Le compose doit inclure :
- Container `nextjs-portfolio` avec build depuis le Dockerfile
- Volume mount vers le dossier Obsidian pour `/content/` (le chemin exact sera précisé)
- Restart policy `unless-stopped`
- Exposition sur port local (ex: 3000) sans exposition directe vers l'extérieur (nginx s'en charge)

---

## Notes d'implémentation

- Utiliser `gray-matter` pour parser le frontmatter YAML
- Utiliser `next-mdx-remote` ou `@next/mdx` pour le rendu MDX
- Le système de volets peut être implémenté avec des `div` CSS flex + un handler `onMouseDown` sur le séparateur, sans dépendance externe
- Pas de base de données — tout est lu depuis le filesystem à chaque build
- `generateStaticParams` pour les routes dynamiques (SSG)
- `next/font` pour charger Oswald et Instrument Sans depuis Google Fonts

---

## Ce qui est hors scope (v1)

- Système de commentaires
- Recherche full-text
- Tags / filtres
- Analytics
- Images dans les articles
- Page de contact

---

*Brief rédigé en mars 2026.*

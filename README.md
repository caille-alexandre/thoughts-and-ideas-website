# alexandrecaille.fr

Portfolio personnel — UI Designer spécialisé en design systems.

## Stack

- **Next.js 16** (App Router, SSG)
- **marked** — rendu Markdown
- **gray-matter** — parsing frontmatter YAML
- CSS custom properties, pas de framework CSS

## Contenu

Les fichiers de contenu sont dans `/content/` :

```
content/
├── about.mdx
├── notes/     ← billets courts (.md)
└── writing/   ← articles longs (.md)
```

Seuls les fichiers avec `published: true` dans le frontmatter sont rendus.
Le dossier `/content/` peut être monté via volume Docker (Obsidian sync).

## Développement

```bash
npm install
npm run dev
```

## Déploiement

Docker sur NAS Synology, derrière nginx reverse proxy.

```bash
docker compose up -d --build
```

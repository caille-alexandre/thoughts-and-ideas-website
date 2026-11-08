# CONTEXT.md — Full Project Context

> Deep reference for LLMs. Read CLAUDE.md first for orientation.

## Project Overview

**alexandrecaille.fr** is a personal portfolio for Alexandre Caillé, a UI designer specializing in design systems. The site serves as both a public presence and a content platform for short-form notes and long-form articles on design and front-end topics. Content is authored as Markdown files in `/content`.

The project deliberately avoids complexity: no CMS, no database, no heavy framework, no Tailwind. It is a focused, maintainable system built around a clear design philosophy — simple purpose, simple architecture, simple design, simple implementation.

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.2.1 |
| Language | TypeScript (strict) | 5.x |
| UI | React | 19.2.4 |
| Styling | CSS variables (no framework) | — |
| Content | Markdown / MDX | — |
| Frontmatter | gray-matter | 4.0.3 |
| Markdown render | marked | 17.0.5 |
| Deployment | Docker → NAS Synology | standalone output |

**There is no Tailwind, no CSS-in-JS, no styled-components, no UI library.** CSS variables *are* the design system — named semantically, owned entirely, readable by humans and agents alike.

---

## Architecture

### Rendering Strategy

- **Static generation** via `generateStaticParams()` for all `[slug]` routes
- `export const dynamic = 'force-dynamic'` on index pages to detect new content files at runtime (no rebuild needed for new notes)
- Output: `standalone` for Docker deployment

### Routing

```
/                     → redirect to /about
/about                → about.mdx + ExperienceTimeline (content/experience/)
/notes                → null (list shown in TriPanelLayout sidebar)
/notes/[slug]         → individual note
/writing              → null (list shown in TriPanelLayout sidebar)
/writing/[slug]       → individual article
```

### Component Architecture

**TriPanelLayout** (`components/TriPanelLayout.tsx`) is the core layout component. It:
- Detects current route using `usePathname()` from `next/navigation`
- Renders 3 columns on desktop (≥768px): Nav | List | Content
- Stacks vertically on mobile
- Hides the ListPanel on `/about`
- Is a `'use client'` component (browser routing detection requires it)

**Data flow:**
```
lib/content.ts (filesystem read)
  → app/layout.tsx (fetches all notes + articles)
    → TriPanelLayout (passes data down)
      → ListPanel (renders the sidebar list)
      → ContentPanel (renders HTML from markdown)
```

---

## Design System

All design tokens are CSS variables defined in `app/globals.css`.

### Color Palette

```css
:root {
  --bg: #F5F0E8;           /* Warm off-white background */
  --accent: #C4603A;       /* Terracotta — primary brand color */
  --text: #1A1208;         /* Near-black for body text */
  --text-muted: /* derived from --text with opacity */
}
```

### Typography

- **Display / Headings**: Oswald (Google Fonts) — geometric, condensed
- **Body / UI**: Instrument Sans (Google Fonts) — humanist, readable
- Scale defined in `globals.css` prose styles

### Gradient Bar

The header gradient uses 4 named stop variables:
```css
--gradient-1: /* warm yellow */
--gradient-2: /* terracotta */
--gradient-3: /* deep brown */
--gradient-4: /* near black */
```

### Prose Styles

`.prose` class in `globals.css` handles all markdown-rendered content:
- Headings (h1–h4), paragraphs, lists, blockquotes, code blocks, inline code
- Links with hover states
- Responsive font sizing

---

## Content Model

### Frontmatter Schema

**Notes** (`content/notes/*.md`):
```yaml
---
title: "Title of the note"
date: "2026-03-15"
published: true
---
```

**Articles** (`content/writing/*.md`):
```yaml
---
title: "Title of the article"
date: "2026-01-10"
description: "Optional excerpt shown in the list"
published: true
---
```

**About** (`content/about.mdx`):
- No frontmatter required — loaded directly (the `# h1` of the file is the page title)

**Experience** (`content/experience/*.md`, one file per job, sorted by `start` descending):
```yaml
---
title: "Product Designer"      # job title
company: "Bedrock Streaming"
start: "2020-04"               # YYYY-MM
end: "2022-03"                 # YYYY-MM — omit for a current position
location: "Paris · Hybride"    # optional
published: true                # false hides it
---
Markdown body = optional description (bullets).
```

### Content Loading (`lib/content.ts`)

```typescript
// Security: slug validated with /^[a-z0-9-]+$/ to prevent path traversal
// published: false → filtered out of lists
// Missing published key → treated as published (shown by default)
// Sorted by date descending
```

Key functions:
- `getNotes()` → returns `Note[]`
- `getArticles()` → returns `Article[]`
- `getNoteBySlug(slug)` → returns single `Note | null`
- `getArticleBySlug(slug)` → returns single `Article | null`
- `getExperiences()` → returns `Experience[]` (`published: false` hidden, newest `start` first)
- `getAboutContent()` → returns the markdown body of `about.mdx`

### TypeScript Types (`lib/types.ts`)

```typescript
interface Note {
  slug: string
  title?: string
  date: string
  content: string
}

interface Article {
  slug: string
  title: string
  date: string
  description?: string
  content: string
}

interface Experience {
  slug: string
  title: string      // job title
  company: string
  start: string      // YYYY-MM
  end?: string       // YYYY-MM, absent = current
  location?: string
  content: string
}
```

---

## Deployment

- **Build**: `next build` with `output: 'standalone'`
- **Container**: Dockerfile → Docker image
- **Host**: NAS Synology (self-hosted)
- **Domain**: alexandrecaille.fr

### Version Control

- **Remote**: Gitea auto-hébergé sur le NAS Synology (pas GitHub)
- **Repo public** : aucun — tout est privé sur le Gitea interne
- Ne jamais suggérer `git push origin` vers GitHub ou un remote public
- Les fichiers `CLAUDE.md`, `CONTEXT.md`, `agents/` sont dans `.gitignore` du repo public (workflow interne uniquement)

### Security Headers

Static headers applied globally via `next.config.ts` → `headers()`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`
- Removes `X-Powered-By`

Dynamic header via `proxy.ts` (Next.js 16 Proxy, runs at Edge before each request):
- `Content-Security-Policy` — generated per request with a unique nonce
- `script-src 'self' 'nonce-{value}' 'strict-dynamic'` — no `unsafe-inline`
- Nonce passed via `x-nonce` request header → read in `app/layout.tsx` via `await headers()`

Nginx Proxy Manager (NPM) layer:
- `more_clear_headers 'Server'` — hides the `openresty` server header
- No CSP override in NPM — CSP is solely managed by `proxy.ts`

**Never remove or weaken these headers.**

---

## Conventions

### File Naming
- Components: `PascalCase.tsx`
- Pages: `page.tsx` (Next.js convention)
- Lib utilities: `camelCase.ts`
- Content: `kebab-case.md`

### CSS Approach
- All values via CSS variables — no hardcoded hex, px, or rem outside `:root`
- No utility classes (no Tailwind, no inline styles for design tokens)
- Mobile-first responsive design

### TypeScript
- Strict mode enabled — `noImplicitAny`, `strictNullChecks`, etc.
- Types defined in `lib/types.ts` or inline within components
- Path alias `@/*` maps to project root

### Content Authoring
- Authored directly as `.md` files in `content/`
- MDX supported but rarely used (`.mdx` for about page only)
- Slug = filename without extension (kebab-case, lowercase, no special chars)

---

## Out of Scope

The following are intentionally **not** part of this project:
- Authentication / user accounts
- Comments or interaction features
- Search functionality (as of current version)
- Analytics (no tracking scripts)
- Newsletter or email capture
- Dark mode toggle (uses system preference via `prefers-color-scheme`)

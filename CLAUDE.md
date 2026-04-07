# CLAUDE.md — Portfolio alexandrecaille.fr

> Entry point for Claude Code. Read this first, then consult [CONTEXT.md](./CONTEXT.md) for full project details.

## Who is Alexandre

UI Designer specializing in design systems. This portfolio is both his public presence and an active personal engineering project. He has strong design intuition and solid front-end knowledge — explanations should respect that expertise.

## What this project is

Personal portfolio at **alexandrecaille.fr** — a Next.js 16 app with a tri-panel layout, content driven by Markdown/MDX files synced from Obsidian. No CMS, no database, no Tailwind.

→ Full technical context: [CONTEXT.md](./CONTEXT.md)

## Agent Profiles

Use these when working in a specific role:

| Role | File | Use when... |
|------|------|-------------|
| UI Designer | [agents/ui-designer.md](./agents/ui-designer.md) | Visual design, tokens, components, design system |
| UX Architect | [agents/ux-architect.md](./agents/ux-architect.md) | Layout structure, IA, interaction patterns |
| Lead Developer | [agents/lead-dev.md](./agents/lead-dev.md) | Architecture decisions, code review, refactoring |
| Front-end Developer | [agents/front-dev.md](./agents/front-dev.md) | React components, CSS, Next.js routing |
| Back-end Developer | [agents/back-dev.md](./agents/back-dev.md) | Content loading, build pipeline, Docker/NAS |

## Critical Rules

1. **No Tailwind** — styled exclusively with CSS variables in `app/globals.css`
2. **No new dependencies** without explicit request — keep the stack minimal
3. **TypeScript strict mode** — no `any`, honor all types in `lib/types.ts`
4. **Content lives in `/content`** — never hardcode content in components
5. **Preserve security headers** in `next.config.ts` — never remove or weaken them
6. **French locale** — dates and UI text use `fr-FR` formatting
7. **No CMS** — content is filesystem-based, synced from Obsidian via `.md`/`.mdx`
8. **`published: false` hides content** — never bypass the `published` flag logic

## Accessibility — RGAA AA

This site targets **RGAA 2.1 niveau AA** (French accessibility standard, aligned with WCAG 2.1 AA). Apply the following rules to all components and content, scoped to what is relevant for a static reading-focused portfolio.

### Semantic structure
- One `<h1>` per page, headings in logical order (no skipping levels)
- Use semantic HTML: `<nav>`, `<main>`, `<article>`, `<header>` — never `<div>` for structural roles
- Every page must have a `<title>` and a `lang="fr"` attribute on `<html>`
- Active navigation item must carry `aria-current="page"`

### Keyboard navigation
- All interactive elements reachable by `Tab` in logical reading order
- Visible and styled focus indicator on every focusable element — use `outline: 2px solid var(--accent)`
- No keyboard trap: the user must be able to Tab through the entire interface without getting stuck

### Color and contrast
- Body text on background: minimum **4.5:1** contrast ratio (RGAA AA)
- Large text (≥18pt or ≥14pt bold) and UI components: minimum **3:1**
- Never use color alone to convey meaning — always pair with text or shape
- Verify any new token added to `globals.css` against the current `--bg` / `--text` pair

### Images and media
- Every `<img>` must have an `alt` attribute — empty `alt=""` for decorative images
- SVG icons used as UI controls need an accessible label (`aria-label` or visually hidden text)
- Never add images to markdown content without alt text in the source

### Links and buttons
- Link text must be meaningful out of context — no "click here" or "read more" without `aria-label`
- Buttons must have a visible label or `aria-label`
- External links should indicate they open in a new tab if `target="_blank"` is used

### Motion and preferences
- Respect `prefers-reduced-motion` — wrap transitions and animations in this media query
- No auto-playing content, no flashing elements

## Eco-Design

The site must be as lightweight and energy-efficient as possible. These rules are non-negotiable.

### Fonts
- **Self-host all fonts** in `public/fonts/` — no external font requests (no Google Fonts CDN)
- Load fonts via `@font-face` in `globals.css` with `font-display: swap`
- Only load the weights actually used (currently: Oswald 400/700, Instrument Sans 400/600)
- Use `woff2` format exclusively — best compression, universally supported

### Assets
- Images: `webp` or `avif` format, explicit `width` and `height` attributes to prevent layout shift
- SVG preferred over raster for icons and illustrations
- No decorative images that add weight without semantic value
- No base64-encoded assets embedded in CSS or JS

### JavaScript
- Default to **server components** — ship zero JS to the browser unless a browser API is required
- `'use client'` is a cost, not a default — justify every usage
- No analytics scripts, no tracking pixels, no third-party embeds
- No polyfills for modern browsers — the portfolio targets evergreen browsers only

### Network
- Static generation (`generateStaticParams`) for all content pages — no runtime server calls
- No external API calls at render time
- `force-dynamic` only on index pages where file-system freshness is needed, and only there
- No CDN-hosted libraries (no unpkg, no jsdelivr) — everything is local or built-in

### CSS
- No unused CSS shipped — `globals.css` is the single stylesheet, keep it lean
- No `@import` inside CSS files — increases render-blocking requests
- Prefer CSS over JS for visual effects (transitions, hover states, layout)

### Build
- `output: 'standalone'` keeps the Docker image minimal — preserve this
- Do not add build plugins or Webpack customizations that increase bundle size without clear benefit

## Project Structure

```
Portfolio/
├── CLAUDE.md                    ← You are here
├── CONTEXT.md                   ← Full technical project context
├── agents/                      ← Agent role profiles
│   ├── ui-designer.md
│   ├── ux-architect.md
│   ├── lead-dev.md
│   ├── front-dev.md
│   └── back-dev.md
│
├── app/                         ← Next.js App Router
│   ├── layout.tsx               ← Root layout (wraps everything in TriPanelLayout)
│   ├── page.tsx                 ← Redirects → /about
│   ├── globals.css              ← Design system: CSS variables + prose styles
│   ├── about/page.tsx
│   ├── notes/
│   │   ├── page.tsx             ← Returns null (list shown in TriPanelLayout)
│   │   └── [slug]/page.tsx
│   └── writing/
│       ├── page.tsx
│       └── [slug]/page.tsx
│
├── components/
│   ├── TriPanelLayout.tsx       ← Core layout: 3-column desktop / stacked mobile
│   ├── ContentPanel.tsx         ← Renders markdown HTML with .prose styling
│   ├── AboutContent.tsx         ← About page specific content
│   ├── ListPanel.tsx            ← Left sidebar: list of notes or articles
│   └── SectionNav.tsx           ← Navigation: About / Notes / Writing
│
├── content/                     ← All site content (Obsidian-synced)
│   ├── about.mdx                ← About page
│   ├── notes/                   ← Short-form notes
│   └── writing/                 ← Long-form articles
│
├── lib/
│   ├── content.ts               ← Filesystem content loader (gray-matter)
│   └── types.ts                 ← Note & Article TypeScript interfaces
│
├── public/                      ← Static assets
├── pencil/                      ← Design files (.pen — use Pencil MCP to read)
├── next.config.ts               ← Next.js config + security headers
├── package.json
└── tsconfig.json
```

## Common Tasks

### Add a new content section (e.g. `/projects`)
1. Create `content/projects/` folder with `.md` files
2. Add loader functions in `lib/content.ts` (mirror existing `getNotes` / `getArticles` pattern)
3. Add types in `lib/types.ts`
4. Create `app/projects/page.tsx` (returns null) and `app/projects/[slug]/page.tsx`
5. Add section to `components/SectionNav.tsx`
6. Handle visibility in `components/TriPanelLayout.tsx` and `components/ListPanel.tsx`

### Modify the design system
- Edit CSS variables in `app/globals.css` under `:root`
- Never use hardcoded color values or sizes — always reference a `--variable`
- Dark mode uses `prefers-color-scheme` media query (not a data-theme toggle yet)

### Add a new component
- Create file in `components/` with PascalCase name, one component per file
- TypeScript interfaces defined inline or imported from `lib/types.ts`
- Style using CSS variables from `:root` only

### Publish / unpublish content
- Set `published: true` or `published: false` in markdown frontmatter
- Missing `published` key defaults to **published** (see `lib/content.ts`)

### Self-host a new font
1. Download `woff2` files for required weights only → place in `public/fonts/`
2. Declare `@font-face` blocks in `globals.css` with `font-display: swap`
3. Remove the corresponding `<link>` from `app/layout.tsx`
4. Verify no external font request in browser DevTools → Network tab

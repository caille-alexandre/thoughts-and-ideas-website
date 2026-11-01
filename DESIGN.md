# DESIGN.md — Design Guidelines

> A portable design system reference. Extracted from **alexandrecaille.fr**. The philosophy and rules here are project-agnostic; the token *values* (colors, fonts) are this project's specific instance — swap them when reusing this file elsewhere, but keep the structure and reasoning.

## Design Philosophy

- **Editorial and warm** — the interface should read like a well-set page, not a dashboard. Confident whitespace, deliberate hierarchy.
- **Precise, unhurried, confident** — no decoration that doesn't carry meaning. Every visual choice is intentional and traceable to a token.
- **Minimal palette** — resist adding colors. Exhaust combinations of existing tokens before introducing a new one.
- **One brand color** — a single accent used consistently for interactive/active state, never diluted across multiple "brand" hues.
- **Content-first** — the design system exists to serve reading and scanning, not to call attention to itself.

## Design Tokens

All tokens live in a single `:root` block in the main stylesheet. No hardcoded values in components — everything resolves to a variable.

### Reference palette (this project)

```css
:root {
  --bg:             #F5F0E8;  /* warm off-white — primary background */
  --surface:        #EDE8DF;  /* slightly darker — cards, code blocks */
  --text:           #1A1208;  /* near-black — body text */
  --text-secondary: #6B5E4A;  /* muted brown — secondary text, quotes */
  --accent:         #C4603A;  /* terracotta — the only brand color */
  --border:         #D9D0C4;  /* hairlines, dividers */

  --font-display:   'Oswald', sans-serif;
  --font-body:      'Instrument Sans', sans-serif;

  /* Decorative gradient bar — 4 stops, warm → dark */
  --gradient-1: #406fb6;
  --gradient-2: #87676f;
  --gradient-3: #f97c21;
  --gradient-4: #f9c98c;
}
```

**Naming pattern**: `--category-variant` (e.g. `--text-muted`, `--bg-elevated`). Add new tokens to `:root` *before* using them — never inline a raw value that should be a token.

### Adapting the palette to a new project

1. Pick one background, one surface (slightly offset from background), one text color, one secondary/muted text color, one border color, **one** accent.
2. Verify body text vs. background hits **4.5:1** contrast; UI components and large text hit **3:1** (WCAG/RGAA AA).
3. Only add a second accent if the first genuinely cannot express a needed distinction (e.g. destructive action) — treat this as an exception, not a default.

## Typography

- **Two-font pairing**: a condensed/geometric **display** face for headings (strong hierarchy, editorial tone) + a humanist **body** face for text (readable, warm). This project uses Oswald (display) + Instrument Sans (body).
- Only load the weights actually used. This project: 400/700 for display, 400/600 for body.
- Self-host fonts as `woff2`, declared via `@font-face` with `font-display: swap`. No third-party font CDNs (no Google Fonts `<link>`).
- Subset by unicode-range (latin / latin-ext) when the font provides it, to avoid shipping unused glyphs.
- Body text: ~15px, line-height ~1.6–1.75 for comfortable long-form reading.
- Heading scale example (prose context): h1 2rem/600, h2 1.375rem/500, h3 1.125rem/500 — each step visually distinct in weight, not just size.
- Use `clamp()` for fluid heading sizes when a layout needs to scale across breakpoints rather than jumping at a single media query.

## Spacing

- Define one **base unit** and snap all spacing to its multiples. This project uses **4px**.
- Prefer `rem` for typographic spacing (margins between prose elements), `px`-derived tokens for structural spacing (padding, gaps).

## Color & Contrast Rules

- Body text on background: minimum **4.5:1** (RGAA/WCAG AA).
- Large text (≥18pt or ≥14pt bold) and UI components (borders, icons, focus rings): minimum **3:1**.
- Never use color alone to convey meaning — pair with text, icon shape, or underline.
- Every new token added to the palette must be checked against the current bg/text pair before use.
- `::selection` should use the accent color for a branded, high-contrast selection state.

## Layout Patterns

### Structural pattern (this project: tri-panel)

```
Desktop (≥768px):
┌──────────────┬──────────────────┬────────────────────────────┐
│  Nav (fixed) │  List (scroll)   │       Content (main)        │
└──────────────┴──────────────────┴────────────────────────────┘

Mobile (<768px): stacked vertically, same order.
```

General principles, portable beyond this exact layout:
- **Single breakpoint** where possible (this project: `768px`) — mobile-first, one clean cutover to desktop rather than many fragmented breakpoints.
- **Navigation is always visible** and anchors the user's position — mark the active item with a distinct, non-color-only state (`aria-current="page"` + accent color).
- **Empty states are a first-class design decision**, not an afterthought — every list/detail pattern needs a specified fallback for "nothing selected."
- Cap primary navigation at a scannable number of items (this project: 5).

## Motion & Interaction

- Micro-interactions (hover, focus, active): `transition: 150ms ease` — fast and precise, never sluggish.
- Focus indicators must always be visible: `outline: 2px solid var(--accent)` (or equivalent) on every focusable element, never `outline: none` without a replacement.
- Wrap all transitions/animations in `@media (prefers-reduced-motion: reduce)` and disable or drastically reduce them for users who request it.
- No auto-playing content, no flashing elements.

## Accessibility Baseline (RGAA / WCAG AA)

- One `<h1>` per page; heading levels never skip.
- Semantic HTML for structure (`<nav>`, `<main>`, `<article>`, `<header>`) — never a `<div>` standing in for a landmark.
- Every `<img>` has `alt`; empty `alt=""` only for purely decorative images.
- SVG icons used as controls get an accessible label (`aria-label` or visually-hidden text).
- Link text is meaningful out of context — no bare "click here" / "read more."
- All interactive elements reachable by `Tab`, in logical order, with no keyboard traps.
- External links opening in a new tab should say so.

## Eco-Design / Performance Principles

- Self-host all fonts — no external font requests.
- Ship zero JS by default; treat any client-side interactivity as a deliberate cost that has to be justified, not the baseline.
- No analytics scripts, tracking pixels, or third-party embeds.
- Static generation over runtime server calls wherever content allows it.
- Images: `webp`/`avif`, explicit `width`/`height` to prevent layout shift; SVG preferred for icons/illustrations.
- No CDN-hosted libraries — everything local or built-in.
- Single stylesheet, no unused CSS, no `@import` chains (each `@import` is an extra render-blocking request).

## Component Authoring Rules

- Style exclusively through variables from `:root` — no hardcoded colors, sizes, or inline styles for design tokens.
- No utility-CSS framework dependency required — plain CSS variables scale fine at this size; only reach for a framework if the component count genuinely demands it.
- Define hover, focus, and active states for every interactive element as part of the component, not as an afterthought pass.
- Flag and fix drift immediately: a hardcoded value that duplicates an existing token should be replaced with `var(--token)`, not left as a one-off.

## Applying This to a New Project

1. Copy this file, rename the reference palette section to the new project's actual values.
2. Re-derive the palette from one background/surface/text/secondary/border/accent set (see "Adapting the palette" above) and re-verify contrast ratios.
3. Pick a display/body font pairing with the same intent (structural contrast: condensed vs. humanist, or serif vs. sans, etc.) — the *pairing logic* matters more than reusing Oswald/Instrument Sans specifically.
4. Re-declare the base spacing unit and re-derive the scale.
5. Re-audit accessibility and eco-design sections against the new project's actual stack (they're largely stack-agnostic, but confirm equivalents exist — e.g. static generation, self-hosted fonts, reduced-motion support).
6. Keep the same discipline: tokens before use, no hardcoded values, minimal palette, contrast-verified before shipping.

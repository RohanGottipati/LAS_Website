# Laurier Analytics Society (LAS) Website

Official marketing site for the **Laurier Analytics Society** — Wilfrid Laurier University’s student-run data community.

Single-page React app with a dark, terminal-inspired UI: hero, about, impact, initiatives, team, datathon, sponsors, FAQ, and newsletter.

## Stack

- **React 18** + **TypeScript**
- **Vite 5**
- **Tailwind CSS 3**
- **Framer Motion** (section reveals / motion)
- **Lucide React** (icons)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Project layout

```
├── index.html              # HTML shell
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── index.tsx           # React entry
│   ├── App.tsx             # Page composition
│   ├── index.css           # Global styles
│   ├── data/site.ts        # All copy, stats, team, FAQs, etc.
│   ├── hooks/              # Shared hooks (e.g. count-up)
│   └── components/         # Page sections + UI primitives
└── ARCHITECTURE.md         # Structure and conventions
```

## Editing content

Almost all site copy lives in **`src/data/site.ts`** — nav links, about text, stats, impact charts, initiatives, team, datathon, sponsors, FAQs, and socials. Prefer changing that file over hardcoding strings in components.

## Design notes

- Generated from a [Magic Patterns](https://www.magicpatterns.com/c/2a21qyqaumtbpafpn3qfba) design, then adapted for LAS.
- Dark theme is forced on `<html>` via `document.documentElement.classList.add('dark')` in `App`.
- Optional `App` props: `asciiDensity` (`'fine' | 'standard' | 'bold'`) and `showSponsors` (boolean).

## License

Private student organization project. All rights reserved unless otherwise noted.

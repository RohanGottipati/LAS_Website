# Architecture

## Overview

This is a **client-only SPA**. There is no backend, database, or API layer in-repo. Vite builds static assets; any newsletter or form behavior that needs a server must be wired later (e.g. Formspree, Mailchimp, or a small edge function).

```
Browser → index.html → src/index.tsx → App → section components
                              ↑
                     src/data/site.ts (content)
```

## Runtime flow

1. `index.html` mounts `#root` and loads `src/index.tsx`.
2. `index.tsx` creates a React 18 root and renders `<App />`.
3. `App` enables dark mode, then stacks section components in order:
   - `Nav` → `Hero` → `About` → `Stats` → `Impact` → `Initiatives` → `Team` → `Datathon` → `Sponsors` (optional) → `Faq` → `Newsletter` → `Footer`
4. Sections pull structured data from `src/data/site.ts` and use shared UI (`Reveal`, `SectionHeading`, `AsciiField`, accordion).

## Key modules

| Path | Role |
|------|------|
| `src/App.tsx` | Page shell, density props, section order |
| `src/data/site.ts` | Single source of truth for marketing content |
| `src/components/AsciiField.tsx` | ASCII / matrix-style visual field used in hero & datathon |
| `src/components/Reveal.tsx` | Scroll / motion reveal wrapper |
| `src/hooks/useCountUp.ts` | Animated number counters for stats |
| `src/components/ui/Accordion.tsx` | FAQ accordion primitive |
| `src/_designSystem/` | Bundled design-system assets from the template (styles / library) |

## Styling

- Tailwind utility classes in components; theme extensions in `tailwind.config.js`.
- Global tokens and base styles in `src/index.css`.
- Design-system CSS under `src/_designSystem/` may be imported by template tooling — treat as generated unless you intentionally customize it.

## Content vs presentation

- **Content** → `src/data/site.ts`
- **Layout / visuals** → `src/components/*`
- Avoid duplicating long copy inside components; import from `site.ts`.

## Build & deploy

- `npm run build` outputs to `dist/`.
- Suitable for static hosts (GitHub Pages, Vercel, Netlify, Cloudflare Pages). Set the host’s publish directory to `dist` and build command to `npm run build`.

## Out of scope (current)

- Auth, CMS, or CMS-driven content
- Server-side rendering
- Real newsletter API (UI only unless you add a provider)

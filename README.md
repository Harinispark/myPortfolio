# HARINI — The Series

A Netflix-inspired personal portfolio for **Harini M**, an Information
Technology undergraduate in Chennai, India, seeking a first role in Software
Testing, Application Support, or IT Operations.

> *Every profile watches the same true story. It only changes what plays first.*

The site is styled like a streaming service — an animated title sequence, a
"Who's watching?" profile picker, billboard sections, progress bars, and a
"To be continued…" finale — but everything on it is a genuine portfolio: the
real resume, real projects, real certifications, and a real story.

**This is an original personal project.** The colour scheme, the red "H"
monogram, the "SERIES" tag, and all copy are original. It is not affiliated
with, endorsed by, or connected to any streaming service.

---

## Features

- **Cinematic intro** — a 4–6 second title sequence, replayable from the navbar
  or the finale. No video asset required.
- **Profile picker** — four "viewers" (Harini / Recruiter / Developer /
  Creative). Each one reorders the home page and the choice persists in the
  backend (an HttpOnly session cookie + a PostgreSQL row), never in
  `localStorage`.
- **Continue Exploring** — five episode tiles that deep-link into the page;
  each fills its progress bar to 100% once that section has been visited.
- **The Screenplay** — the resume as a page section, plus a printable
  `/resume` route with real print styles.
- **Genres: My Skill Universe** — a keyboard-accessible tablist of skill
  categories with animated tiles.
- **Originals** — billboard project cards using the real project data.
- **My Journey** — five seasons (2022 → 2026) of episode cards.
- **Accessible by default** — skip link, focus-visible outlines, roving
  tabindex, WAI-ARIA tablists, labelled progress bars, and a complete
  `prefers-reduced-motion` kill-switch.
- **Cinematic motion layer** — Lenis inertial smooth scrolling, a scroll
  progress line, pointer-following cursor spotlight, magnetic CTAs, 3D tilt
  cards with a cursor-tracked spotlight, View-Transitions cross-fades between
  routes, and a drifting aurora behind the hero. On top of that: scroll-linked
  **parallax** (hero portrait + section key-art), a section-title **wipe-in**
  with a staggered card cascade, an **ambient backdrop** that cross-fades to
  each section's accent as you scroll, a "Now trending" **marquee**, a **sheen**
  sweep on CTAs and episode tiles, **animated stat counters**, and retracting
  **letterbox bars** on the intro. Every effect is inert under
  `prefers-reduced-motion`.
- **Motion toggle** — the navbar profile menu carries System / Full / Reduced
  so the effects can be previewed (or frozen) regardless of the OS setting. The
  choice is per-visit (in-memory); the OS `prefers-reduced-motion` value is the
  default.
- **Inline editing** — the owner can edit every database-backed section in
  place. Press `Shift+E` (or open a URL ending in `#edit`), enter the admin
  token, then use the pencil / trash / reorder arrows rendered on each card.
  Writes go to the API with an `X-Admin-Token` header and the page refreshes
  from the database; the token is held in memory only (never stored).
- **SEO-ready** — descriptive meta tags, Open Graph / Twitter cards, JSON-LD
  `Person` schema, and a `<noscript>` fallback.

---

## Content is served by an API

The prose/portfolio content no longer lives only in the bundle. A companion
backend — a **separate repository**,
[`Harinispark/myPortfoliobackend`](https://github.com/Harinispark/myPortfoliobackend)
(Node + Express + Prisma + PostgreSQL), deployed to Render — is the **source of
truth**: the app fetches the whole page from `GET /api/site` and stores the
active viewer via `GET/PUT/DELETE /api/session` (see that repo's README).

- The bundled `src/data/*` files are still shipped and render immediately as an
  offline / first-paint fallback (`buildLocalContent()`), so the site never
  breaks when the API is unreachable.
- The dev server proxies `/api` to `http://localhost:4000` (see
  `vite.config.ts`). In production `vercel.json` proxies `/api/*` to the
  deployed API, so the browser stays **same-origin** and the session cookie
  works without CORS changes; alternatively set `VITE_API_BASE` to the API URL
  and configure CORS plus a `SameSite=None; Secure` cookie.
- Because sessions use cookies, the API must be same-site (or CORS-configured
  with credentials) for the "watching as …" state to persist.

---

## Editing content in place

Content is edited **in the browser**, against the live API — no code changes,
no `localStorage`.

1. **Enter edit mode** — press `Shift+E`, or add `#edit` to the URL
   (`http://localhost:5173/#edit`). A prompt asks for the admin token.
2. **Unlock** — the token is checked against `GET /api/admin/verify` and, if it
   matches `ADMIN_TOKEN`, the UI switches to edit mode. The token lives **only
   in memory**: a reload drops back to read mode and you must re-enter it.
3. **Edit rows** — in edit mode each card shows small controls (reorder ↑ ↓,
   pencil, trash), and sections gain an "Add …" button. The pencil opens a form
   for one row (for *Journey*, one season also edits its nested episodes);
   the pencil on the reorder panel (`Home layout`) reorders the home page for a
   selected viewer profile.

**What's editable** — every database-backed table: education, internships,
projects, skill categories, certifications, continue tiles, and seasons/episodes,
plus each profile's `sectionOrder`.

**What stays in code** — the chrome that must render even offline or in
production: the hero, about, stats, and finale copy, the nav, and site meta
(these come from `src/data/*`).

Client validation mirrors the backend Zod rules; every mutation sends the
`X-Admin-Token` header, and a successful save calls `refresh()` so the page
reflects the database immediately. When the API is unreachable the site falls
back to the bundled content and the editor reports **Offline — read-only**.

---

## Tech stack

| Purpose        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | React 19 + TypeScript                              |
| Build tool     | Vite 8                                             |
| Routing        | React Router 7                                     |
| Styling        | Tailwind CSS v4 (CSS-first `@theme`, no config)    |
| Animation      | `motion` (Framer Motion)                           |
| Smooth scroll  | Lenis                                              |
| Gestures       | `@use-gesture/react`                               |
| Loaders        | `ldrs` (route-level Suspense loader)               |
| Fonts          | Self-hosted Bebas Neue + Inter (`/public/fonts`)   |
| Linting        | oxlint                                             |
| Backend        | Node + Express 5 + Prisma + PostgreSQL (separate repo: `myPortfoliobackend`) |
| Hosting target | Vercel (see `vercel.json`)                         |

---

## Getting started

The frontend works standalone (it falls back to the bundled content), but to
use the live database-backed content and the persisted viewer session, run the
backend too. Clone
[`myPortfoliobackend`](https://github.com/Harinispark/myPortfoliobackend) as a
sibling folder named `backend` (so the commands below line up).

```bash
# terminal 1 — the API (its README documents the single .env)
cd ../backend
npm run dev      # http://localhost:4000

# terminal 2 — the web app
npm install
npm run dev      # http://localhost:5173 (proxies /api → :4000)
npm run build    # type-check + production build → dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

---

## Deploying

This repo is the **front end only** and deploys to Vercel on its own:

- **Vercel** — import this repository, leave **Root Directory** empty (the app
  is the repo root) and keep the framework preset **Vite**. `vercel.json`
  already sets the build (`npm run build` → `dist/`), the SPA rewrite, asset
  caching, and the `/api` proxy.
- **Back end** — deployed separately from
  [`Harinispark/myPortfoliobackend`](https://github.com/Harinispark/myPortfoliobackend)
  on Render, via that repo's `render.yaml`.
- Set the `/api/(.*)` rewrite in `vercel.json` to your Render service URL, e.g.
  `https://myportfoliobackend-c9pu.onrender.com/api/$1`, and leave `VITE_API_BASE`
  unset so the app calls the API same-origin (cookies just work).
- One env file only: the backend repo's `.env`. Production secrets live in the
  Render dashboard, never in either repo.

---

## Project structure

```
src/
├── components/
│   ├── brand/       # Monogram + Logo
│   ├── common/      # Button, Carousel, Chip, Photo, ProgressBar, Reveal,
│   │                # SectionHeading (wipe-in title), StatTile (count-up), …
│   ├── edit/        # inline editor: EditLayer, UnlockDialog, EntityEditor, Field,
│   │                # RowControls, AddRowButton, EditRowButton, SectionReorder, …
│   ├── intro/       # IntroSplash (animated title sequence), Letterbox
│   ├── layout/      # Navbar, MobileMenu, AvatarMenu (profile + motion), Footer,
│   │                # SectionRenderer
│   ├── motion/      # SmoothScroll, ScrollProgress, Tilt, CursorSpotlight,
│   │                # Magnetic, ViewTransitionLink, Parallax, Stagger,
│   │                # AmbientBackdrop, Marquee
│   ├── profiles/    # ProfilePicker, ProfileAvatar
│   └── sections/    # Hero, ContinueExploring, ResumeSection, SkillUniverse,
│                    # Originals, Certifications, About, Journey, Finale
├── context/         # ProfileContext (stage machine + session), SiteContentContext
│                    # (API content), EditModeContext (inline editor), MotionContext
│                    # (motion toggle), ToastContext
├── data/            # bundled content (offline fallback for the API)
├── hooks/           # useActiveSection, useWatchedSections, usePrefersReducedMotion, …
├── lib/             # constants, cn, accents, sectionOrder, api/ (typed fetch + bundle),
│                    # edit/ (resource registry + validation for the editor)
├── pages/           # HomePage, ResumePage, NotFoundPage
├── types/           # the domain model every data file conforms to
└── index.css        # design tokens, accent system, utilities, print styles
```

### Content flows from the database

The page content is fetched once from `GET /api/site` (typed in
`src/lib/api/content.ts` as `ContentBundle`) and exposed through
`SiteContentContext`. `src/data/*` holds the same shape and is used as the
immediate/offline fallback. Components read `useSiteContent().content` — they
never import the data files directly — so switching a field in the database is
reflected without a redeploy.

---

## Adding the two optional assets

Both are optional — the site degrades gracefully without them.

1. **Portrait** — drop a head-and-shoulders photo on a plain white background
   at `public/harini-portrait.png`. The hero masks and fades it into the dark
   theme, so no transparent cutout is needed. Until it exists, a styled
   monogram placeholder is shown instead.

2. **Resume PDF** — drop the file at `public/resume.pdf`. The "Download
   Resume" button probes for it at runtime: when the file is present it
   becomes a real download link, otherwise it stays a disabled
   "PDF coming soon" button instead of 404ing.

---

## Customising

The **database is the source of truth** for content. For anything you can reach
from the browser, the fastest path is the **in-browser editor** (press
`Shift+E` — see *Editing content in place* above). To seed or reset data, edit
the corresponding Prisma model/seed in `../backend` and re-seed.

| I want to change…            | Edit…                                            |
| ---------------------------- | ------------------------------------------------ |
| Any content shown on a card  | the in-browser editor (`Shift+E`) — no redeploy  |
| Home-page section order      | the editor's *Home layout* panel (`Shift+E`)     |
| Name, tagline, contact, SEO  | `src/data/site.ts` + `src/data/navigation.ts` (chrome) / backend seed (content) |
| Resume content               | `../backend/prisma/seed.ts` (education, internships, skills, certifications) |
| Projects                     | `../backend` `Project` rows (add `githubUrl` / `liveUrl`) |
| Skills / certifications      | `../backend` `SkillCategory` / `Certification` rows |
| Journey seasons & episodes   | `../backend` `Season` / `Episode` rows           |
| Profile reorder behaviour    | `../backend` `ViewerProfile.sectionOrder`        |
| Colours, type, motion        | the `@theme` block in `src/index.css`            |
| Motion toggle default/intensity | `src/context/MotionContext.tsx` + `src/index.css` |
| Section → ambient accent     | `src/components/motion/AmbientBackdrop.tsx`      |
| Deploy URL / canonical tag   | `index.html` (the commented `<link rel="canonical">`) |

---

## Accessibility notes

- The profile picker and the two tablists (skills, journey) use roving
  tabindex and arrow-key navigation.
- The mobile menu restores focus and locks scroll while open.
- Progress bars expose `role="progressbar"` with real values.
- `prefers-reduced-motion: reduce` collapses every transition and animation
  and disables smooth scrolling. The navbar **Motion** menu can override this
  per visit (System / Full / Reduced); the override also mirrors onto `<html>`
  as `.motion-reduced` so CSS-only effects honour it.

---

## License

Personal project. Content and identity belong to Harini M. Not affiliated with
any streaming service.

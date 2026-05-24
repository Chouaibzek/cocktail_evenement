# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

## Stack

- React 19 + TypeScript 6, bundled with Vite 8
- Tailwind CSS v4 (configured via `@theme` block in `src/index.css`, not a config file)
- `@vitejs/plugin-react` (uses Oxc for transforms)
- Supabase (`@supabase/supabase-js`) for auth + database
- EmailJS (`@emailjs/browser`) for transactional emails
- `@schedule-x/calendar` + `@schedule-x/react` for the date-picker calendar
- `react-hook-form` + `zod` + `@hookform/resolvers` for form validation
- `react-router-dom` v7 for routing
- ESLint with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

## Environment variables

Required in `.env`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID_RESERVATION=
VITE_EMAILJS_PUBLIC_KEY=        # optional — email sending is skipped if absent
```

## Architecture

### Routing (`src/App.tsx`)

Seven routes, all top-level:

| Path | Page |
|---|---|
| `/` | Home |
| `/carte` | Catalogue |
| `/reservation` | Reservation (calendar) |
| `/reservation/formulaire?date=YYYY-MM-DD` | ReservationForm |
| `/login` | Login |
| `/register` | Register |
| `/admin` | Admin (redirects non-admins to `/`) |

No nested layouts — every page renders `<Navbar />` itself.

### Auth (`src/hooks/useAuth.tsx`)

`AuthProvider` wraps the app and exposes `{ user, profile, loading, signOut }` via `useAuth()`. On mount it calls `supabase.auth.getSession()` and subscribes to `onAuthStateChange`. The `profile` object is fetched from the `profiles` Supabase table (columns: `id`, `nom`, `prenom`, `telephone`, `adresse`, `role: 'client' | 'admin'`).

`AuthProvider` wraps `<App>` in `main.tsx`, so auth context is available app-wide.

### Reservation flow

1. `/reservation` shows a Schedule-X month-grid calendar. Clicking a date redirects to `/reservation/formulaire?date=YYYY-MM-DD` (or to `/login?redirect=...` if unauthenticated).
2. `/reservation/formulaire` reads `date` from `useSearchParams`, pulls `user`/`profile` from `useAuth`, and on submit:
   - Inserts a row into the `reservations` Supabase table (`date`, `client_id`, `nb_invites`, `message`, `lieu_evenement`, `type_evenement`, `statut: 'en_attente'`). Unique constraint on `date` — duplicate date returns error code `23505`.
   - Optionally sends an email via `src/services/emailService.ts` (skipped if `VITE_EMAILJS_PUBLIC_KEY` is not set).

### Admin page (`/admin`)

Accessible only to users with `profile.role === 'admin'` (redirects others to `/`). Two tabs:
- **Réservations**: lists all reservations joined with `profiles` (nom, prenom, telephone). Admin can update `statut` (`en_attente` → `confirmée` | `annulée`) inline.
- **Calendrier**: custom month-grid calendar. Clicking a free date inserts a row in the `disponibilites` table (`statut: 'bloque'`); clicking a blocked date deletes it. Dates with active reservations cannot be toggled.

### Design system

Defined in `src/index.css` via Tailwind v4 `@theme`:

| Token | Value |
|---|---|
| `cream` | `#F5EDE3` (background) |
| `charcoal` | `#1A1714` (text) |
| `accent` | `#B5785A` (terracotta) |
| `circle` | `#E8D0C0` |
| `font-display` | Cormorant Garamond (headings, italic) |
| `font-body` | DM Sans (body text) |

Use `className="font-display"` / `className="font-body"` and `text-cream`, `text-charcoal`, `bg-accent`, etc. for consistency.

### Static data

`src/data/cocktails.ts` exports `cocktails: Cocktail[]` and `categories: Categorie[]`. Cocktail images are imported directly from `src/assets/`. Categories are `'Signature' | 'Classique' | 'Fruité' | 'Sans alcool'`.

## ESLint note

The current config uses `tseslint.configs.recommended` (no type-aware rules). To enable stricter type-checked linting, switch to `tseslint.configs.recommendedTypeChecked` and add `parserOptions.project` pointing to `tsconfig.node.json` and `tsconfig.app.json` — see README.md for the exact snippet.

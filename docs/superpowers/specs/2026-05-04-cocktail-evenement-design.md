# Design Spec — Cocktails by Sara : Page de garde

Date : 2026-05-04

## Périmètre

Page de garde uniquement (les autres pages seront spécifiées séparément).

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (via @tailwindcss/vite, config dans index.css)
- React Router v6 (BrowserRouter, route "/" → Home)
- lucide-react (icônes Navbar)

## Design system

| Token | Valeur | Usage |
|---|---|---|
| `--color-cream` | `#F5EDE3` | Fond général |
| `--color-charcoal` | `#1A1714` | Texte principal |
| `--color-accent` | `#B5785A` | Tag, hover, liquide verre |
| `--color-circle` | `#E8D0C0` | Cercle derrière le verre |
| `--font-display` | Cormorant Garamond (serif italic) | Titres |
| `--font-body` | DM Sans | Corps, nav, boutons |

## Architecture fichiers

```
src/
├── index.css                  → @theme tokens + reset
├── App.tsx                    → BrowserRouter + Route "/"
├── pages/Home.tsx             → Hero section
└── components/
    ├── Navbar.tsx             → Barre fixe
    └── MartiniGlass.tsx       → SVG animé au scroll
```

## Navbar

- Fixe en haut, fond cream
- Logo : "S" monogramme + "Cocktails by Sara" (placeholder, logo réel fourni ensuite)
- Liens centrés (desktop) : ACCUEIL | LA CARTE | PRESTATIONS | GALERIE | CONTACT
- Bouton DEVIS (bordure charcoal) à droite
- Mobile : logo gauche + hamburger droit (Menu/X via lucide-react), menu déroulant

## Hero Section

Layout 2 colonnes (desktop) / 1 colonne (mobile) :

**Colonne gauche :**
- Tag : "— MIXOLOGIE ÉVÉNEMENTIELLE" (tracking large, couleur accent)
- H1 : "L'art du cocktail, à votre image." (Cormorant Garamond italic, ~72-80px)
- Description : "Mariages, anniversaires, soirées privées..."
- CTA primaire : "RÉSERVER UNE DATE" (fond charcoal)
- CTA secondaire : "DÉCOUVRIR LA CARTE ›" (lien texte)

**Colonne droite :**
- Grand cercle fond `--color-circle`
- SVG verre martini animé au scroll

## Animation verre (Option B — scroll natif)

- `useEffect` + `window.addEventListener('scroll', handler, { passive: true })`
- `scrollRatio = scrollY / (scrollHeight - innerHeight)` → clampé [0, 1]
- SVG : bowl triangle (y=50 → y=175), clipPath révèle le liquide du bas vers le haut
- `liquidY = 175 - scrollRatio * 125` → contrôle la hauteur du liquide visible
- Couleur liquide : `rgba(181, 120, 90, 0.22)`

## Contraintes

- Pas de backend, pas d'état global
- Les liens de navigation sont des `href="#"` (placeholder) — les pages seront ajoutées progressivement
- Logo fourni par la cliente → placeholder SVG "S" pour l'instant

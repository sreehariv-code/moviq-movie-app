# Moviq Movie App - UI/UX Revamp Plan

This document outlines the roadmap for transforming Moviq into a premium, cinematic movie discovery platform.

## 1. Vision & Design System
The goal is to move from a standard grid-based app to a "Cinematic Dark" aesthetic inspired by platforms like Netflix, Apple TV, and Letterboxd.

### Aesthetics
- **Theme:** Deep Ink Black background (`#050505`) with Glassmorphism (blur effects).
- **Accent Color:** Electric Purple (`#8b5cf6`) for primary, Vivid Red (`#ef4444`) for accents.
- **Typography:** Inter font family for better readability.
- **Interactions:** Subtle scale effects, smooth page transitions, and skeleton loaders.

---

## 2. Technical Stack Modernization
We will streamline the dependencies to improve performance and developer experience.

| Category | Before | After (Achieved) |
| :--- | :--- | :--- |
| **Framework** | React 18.2 / Vite 4.0 | **React 19.2 / Vite 7.3** |
| **Styling** | Tailwind 3.3 + DaisyUI | **Tailwind 4.1 + Shadcn UI** |
| **Data Fetching** | Axios + `useEffect` | **TanStack Query 5.90** |
| **Animations** | Framer Motion 8.5 | **Framer Motion 12.29** |
| **Icons** | React Icons | **Lucide React** |
| **Carousels** | Swiper + Splide | **Embla Carousel 8.6** |
| **Routing** | React Router 6.7 | **React Router 7.13** |

### Removed Dependencies
- DaisyUI, react-icons, swiper, @splidejs/splide, react-spinners-kit, styled-components, react-loading-skeleton

### New Project Structure
```
src/
├── components/
│   ├── ui/              # Shadcn UI components (Button, Card, Skeleton, etc.)
│   ├── Hero/            # HeroCarousel component
│   ├── ContentSection/  # Reusable content section with carousel
│   └── Card/            # MovieCard with 3D effects
├── hooks/
│   └── useMovies.js     # TanStack Query hooks
├── lib/
│   ├── api.js           # Axios instance & helpers
│   └── utils.js         # cn() utility for classnames
└── index.css            # Tailwind v4 CSS-based theme config
```

---

## 3. Detailed Roadmap

### Phase 1: Foundation & Infrastructure ✅
- [x] Upgrade Vite, React, and Tailwind to latest versions.
- [x] Initialize **Shadcn UI** and define a premium color palette in CSS (Tailwind v4 style).
- [x] Set up **TanStack Query** for robust API state management.
- [x] Standardize icons (Lucide) and remove redundant libraries.

**Bundle Impact:** JS reduced from 522 kB to 358 kB (31% smaller)

### Phase 2: Global Navigation & Hero Experience ✅
- [x] **Sticky Glassmorphic Navbar:** Fixed navbar with transparent → glass transition on scroll, animated route indicator.
- [x] **Hero Carousel:** Auto-playing (6s) full-bleed carousel with top 5 trending content, dynamic backdrops, animated content, and action buttons.
- [x] **Trending Scroll:** New `MovieCard` component with Framer Motion 3D pop effects, glow on hover, and rating badges.

**New Components:** `HeroCarousel`, `ContentSection`, `MovieCard`

### Phase 3: Discovery & Search ✅
- [x] **Advanced Search:** Real-time results with debounced input, media type tabs (All/Movies/TV).
- [x] **Filter System:** Collapsible filter panel with Genre, Year, Min Rating, and Sort options.
- [x] **Skeleton States:** Grid skeleton loader for search results, animated stagger on results.

**Features:**
- Dual mode: Search (with query) and Discover (browse without query)
- Smart pagination with ellipsis for large page counts
- Empty states with helpful messaging
- "Updating..." badge during background refetches

**New Hooks:** `useAdvancedSearch`, `useDiscoverMovies`, `useMovieGenres`, `useTVGenres`

### Phase 4: Cinematic Detail Pages ✅
- [x] **Backdrop Integration:** Full-bleed backdrop with gradient overlays, glassmorphism info cards.
- [x] **Cast Showcase:** Circular portraits with hover effects, horizontal carousel for cast members.
- [x] **Trailer Modal:** Radix Dialog-based modal with YouTube embed and autoplay.

**Movie Detail Page Features:**
- Full-bleed backdrop with poster overlay
- Rating badge with star icon, runtime, release date
- Genre badges, tagline display
- Watch Trailer button (fetches from TMDB videos API)
- Sidebar with Director, Writers, Budget, Revenue, Languages, Production companies
- Skeleton loading state and error handling

**TV Show Detail Page Features:**
- TV Series badge, season/episode counts
- Last Episode section with thumbnail
- Seasons list with poster thumbnails
- Created By, Network, Status info
- Same cinematic backdrop treatment as movies

**New Components:** `TrailerModal`, `Dialog` (Radix-based)
**New Hooks:** `useTVVideos`

### Phase 5: Polish & Performance ✅
- [x] **Shared Layout Transitions:** Smoothly animate movie cards into detail views using Framer Motion's `layoutId`.
- [x] **Infinite Scrolling:** Smooth loading for category-specific pages with `useInfiniteQuery` and intersection observer.
- [x] **PWA Support:** VitePWA configured with manifest, service worker, and runtime caching for TMDB API/images.

---

## 4. Next Steps
1. ~~**Run `npm audit fix --force`** to upgrade the core build tools.~~ ✅
2. ~~**Initialize Shadcn UI** and configure the design tokens.~~ ✅
3. ~~**Refactor the Home Page** layout as the first visual proof of concept.~~ ✅
4. ~~**Implement Phase 3:** Redesign the Search page with filters and real-time results.~~ ✅
5. ~~**Implement Phase 4:** Redesign movie/TV detail pages with cinematic backdrop and trailer modal.~~ ✅
6. ~~**Implement Phase 5:** Add shared layout transitions, infinite scrolling, and PWA support.~~ ✅

**All phases complete!** See `explore_expansion_plan.md` for future expansion features.

# Moviq Movie App - Discovery & Explore Expansion Plan

This plan focuses on completing the missing discovery routes (`/movies` and `/tv`) and implementing premium browsing features as outlined in the general revamp vision.

## Goal
Transform the "Movies" and "TV Shows" placeholders into fully functional, high-performance discovery hubs with advanced filtering and infinite scrolling.

---

## 1. Route Configuration ✅
Register the currently missing routes in `src/routes/Routes.jsx`.

- [x] Add route for `/movies` mapping to `ExplorePage` (mediaType: movie).
- [x] Add route for `/tv` mapping to `ExplorePage` (mediaType: tv).

---

## 2. Component Architecture ✅
Create a unified `ExplorePage` component to keep the codebase DRY (Don't Repeat Yourself).

### New Location: `src/pages/ExplorePage/`
- [x] `ExplorePage.jsx`: Main container handling the media type logic and state.
- [x] `FilterSidebar.jsx`: A slide-out or sticky sidebar for selecting genres, year, and sorting.
- [x] `ExploreGrid.jsx`: The results display area with infinite scroll loading.

---

## 3. Technical Implementation ✅

### Data Fetching
- [x] Utilize the existing `useInfiniteDiscover` hook from `useMovies.js` (updated to support both movie/tv).
- [x] Fetch genres dynamically using `useMovieGenres` and `useTVGenres`.

### Features
- [x] **Infinite Scroll**: Using `useIntersectionObserver` hook to trigger `fetchNextPage` from TanStack Query.
- [x] **Advanced Filtering**:
    - **Sort By**: Popularity, Release Date (Newest/Oldest), Vote Average.
    - **Genres**: Genre pill selection with "All" option.
    - **Year Range**: Dropdown with years from current back to 1900.
    - **Min Rating**: Radio button selection with star visualization.
- [x] **Responsive Layout**: Sidebar collapses into a slide-out drawer on mobile with backdrop blur.
- [x] **Skeleton States**: Staggered skeleton cards while fetching (20 cards with delay animation).

---

## 4. UI/UX Aesthetics (Cinematic Dark) ✅
- [x] **Glassmorphism**: Filter panels using `glass` class with backdrop blur.
- [x] **Micro-interactions**: Hover states on filter pills, staggered "pop-in" animations for cards.
- [x] **Sticky Controls**: Filters remain sticky (`sticky top-24`) while scrolling.
- [x] **Active Filter Badges**: Display active filters with remove buttons.

---

## 5. Execution Steps ✅
1. [x] **Setup**: Created `src/pages/ExplorePage/` folder structure and registered routes.
2. [x] **Logic**: Implemented infinite scroll with `useInfiniteDiscover` hook (updated for movie/tv support).
3. [x] **UI**: Built Filter Sidebar with genre pills, year dropdown, rating radio buttons.
4. [x] **Polish**: Added smooth Framer Motion transitions, loading states, and empty states.
5. [x] **Validation**: Both Movie and TV categories work with proper TMDB API parameters.

---

## Implementation Complete! 🎉
All features from this expansion plan have been implemented.

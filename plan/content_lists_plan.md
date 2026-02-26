# Plan: Content Listing Pages Expansion

## Objective
Implement dedicated pages for specific content lists such as Popular and Trending for both Movies and TV Shows. These routes will provide a focused browsing experience beyond the general filter-based "Explore" page.

## 1. Data Layer Enhancements
Update `src/hooks/useMovies.js` to include infinite loading hooks for specific list types:

- **`useInfiniteTrending(mediaType, timeWindow = 'day')`**: 
  - Endpoint: `/trending/${mediaType}/${timeWindow}`
  - Purpose: Infinite scroll for trending daily/weekly content.
- **`useInfinitePopular(mediaType)`**: 
  - Endpoint: `/${mediaType}/popular`
  - Purpose: Infinite scroll for all-time popular items.
- **`useInfiniteTopRated(mediaType)`**: 
  - Endpoint: `/${mediaType}/top_rated`
  - Purpose: Infinite scroll for highest-rated content.

## 2. Route Configuration
Register the new routes in `src/routes/Routes.jsx`:

- `/movies/popular` -> `ExplorePage` (with mode: popular)
- `/movies/trending` -> `ExplorePage` (with mode: trending)
- `/tv/popular` -> `ExplorePage` (with mode: popular)
- `/tv/trending` -> `ExplorePage` (with mode: trending)
- `/movies/top-rated` -> `ExplorePage` (with mode: top-rated)
- `/tv/top-rated` -> `ExplorePage` (with mode: top-rated)

## 3. UI Implementation Strategy
Instead of creating separate pages for each, we'll enhance the existing `ExplorePage.jsx` to handle different "modes".

### **Dynamic Mode Selection**
- Use the current URL path to determine the `mode` (Discover, Popular, Trending, Top-Rated).
- **Discover**: Full filtering enabled (Genre, Year, etc.).
- **Popular/Trending/Top-Rated**: Specialized lists where certain filters (like `sortBy`) might be disabled as they are pre-defined by the endpoint.

### **Header Updates**
- Update page titles dynamically:
  - `/movies/popular` -> "Popular Movies"
  - `/tv/trending` -> "Trending TV Shows"
- Update the subtitle with relevant counts.

### **Hook Integration**
Refactor the fetching logic in `ExplorePage.jsx`:
```javascript
const listHook = mode === 'trending' 
  ? useInfiniteTrending(mediaType)
  : mode === 'popular'
  ? useInfinitePopular(mediaType)
  : useInfiniteDiscover({ ...filters }); // default discover mode
```

## 4. Visual Enhancements
- **Breadcrumbs**: Add breadcrumbs for easier navigation (Home > Movies > Trending).
- **Search Context**: Ensure that even on these listing pages, the user can easily switch between Movie/TV segments.

## 5. Implementation Steps
1. **Hooks**: Add `useInfiniteTrending`, `useInfinitePopular`, and `useInfiniteTopRated` to `useMovies.js`.
2. **Routes**: Update `Routes.jsx` with the new nested paths.
3. **Logic**: Refactor `ExplorePage.jsx` to accept different modes and switch hooks accordingly.
4. **UX**: Add informative headers and ensure infinite scrolling works seamlessly across all list types.
5. **SEO Pad**: Add dynamic meta tags for these specific high-traffic routes.

## 6. Success Criteria
- ✅ `/movies/popular` shows infinitely scrollable list of popular movies.
- ✅ `/tv/trending` shows most-watched TV shows of the day/week.
- ✅ Navigation is consistent across all listing pages.
- ✅ Page titles update correctly based on the route.

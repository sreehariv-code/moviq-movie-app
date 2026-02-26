# Plan: Person Details Page Implementation

## Objective
Create a dedicated details page for actors and crew members to provide users with biographies, career history, and their collection of movies/TV shows.

## 1. Data Layer Enhancements
### New Hooks in `src/hooks/useMovies.js`
- **`usePersonDetails(id)`**:
  - Endpoint: `/person/${id}`
  - Purpose: Get bio, birthday, place of birth, social links, and known_for_department.
  - Returns: `{ data, loading, error }`
  - Error handling: Return null data with error message for invalid IDs

- **`usePersonCredits(id)`**:
  - Endpoint: `/person/${id}/combined_credits`
  - Purpose: Get all movies and TV shows where the person was part of the cast or crew.
  - Returns: `{ cast, crew, loading, error }`
  - Data processing: Sort by popularity and release date

- **`usePersonImages(id)`**:
  - Endpoint: `/person/${id}/images`
  - Purpose: (Optional) For a gallery of professional headshots.
  - Returns: `{ profiles, loading, error }`

## 2. Route Definition
In `src/routes/Routes.jsx`:
- Add `<Route element={<PersonPage />} path="person/:id" />` under the `NavbarLayout`
- Use lazy loading: `const PersonPage = lazy(() => import('../pages/PersonPage/PersonPage'))`
- Wrap with `Suspense` and fallback to `Loader` component

## 3. Page Structure (`src/pages/PersonPage/PersonPage.jsx`)

### **Loading State**
- Use existing `Loader` component while fetching person details
- Skeleton loaders for individual sections (optional enhancement)

### **Error State**
- Handle 404 for invalid person IDs
- Display user-friendly error message with navigation back to home
- Handle API failures gracefully

### **Header Section** (Visual Hub)
- **Profile Image**:
  - Large headshot (300x450px) with premium shadow/border
  - Fallback to default avatar icon if no profile image available
  - Optional: Blurred backdrop of profile image behind header
- **Identity**:
  - Name (h1)
  - Current age (calculated from birthday)
  - Known department badge (e.g., "Acting", "Directing")
- **Socials**:
  - Direct links to Instagram/Twitter/IMDb if available
  - Open in new tabs (`target="_blank" rel="noopener noreferrer"`)
  - Display as icon buttons with hover effects

### **Biography Section**
- Text area with a "Read More" toggle for biographies longer than 300 characters
- Use glassmorphism container for the background
- Handle missing biography with placeholder text (e.g., "No biography available")
- Preserve line breaks and formatting from API

### **Personal Info Sidebar (or Grid Item)**
- **Birthday**: Format as "Month Day, Year (Age X)"
- **Place of Birth**: Full location string
- **Gender**: Display as text (Male/Female/Non-binary)
- **Known For**: Department (Acting, Directing, etc.)
- Use key-value layout with consistent spacing

### **"Known For" Carousel**
- Display top 10 most popular projects from combined credits
- Use existing `Carousel` and `MovieCard` components
- Sort by `popularity` field from credits data
- Mix both movies and TV shows
- Show "No known works" if credits are empty

### **Filmography Section**
- **Layout**: Two-column grid on desktop, single column on mobile
- **Grouping**: Group by decade (2020s, 2010s, etc.) for better readability
- **Display Details**:
  - For Cast: Title, Year, Character name, Media type badge
  - For Crew: Title, Year, Job title, Media type badge
- **Filtering**:
  - Tabs/buttons for "All", "Cast", "Crew"
  - Show count badges (e.g., "Cast (45)")
- **Sorting**:
  - Default: Chronologically (newest first)
  - Option to sort by popularity
- **Performance**:
  - Show first 20 credits initially
  - "Load More" button for extensive filmographies (50+ credits)
- **Empty State**: Handle persons with no credits gracefully

## 4. Interaction Updates

### **CastCard Component**
Update `src/components/Card/CastCard.jsx` to:
- Accept an `id` prop (person ID from TMDB)
- Wrap the component in a `Link` to `/person/${id}`
- Apply the `cursor-pointer` class (already added)
- Add hover effect (scale transform) to indicate clickability
- Ensure proper accessibility (aria-label with person name)

### **Search Integration**
**Update SearchPage logic:**
- Detect `media_type === "person"` in search results
- Render `PersonCard` component for person results
- Handle mixed results (movies, TV shows, and people)

**Create PersonCard Component** (`src/components/Card/PersonCard.jsx`):
- Similar structure to `CastCard` but optimized for grid layouts
- Display:
  - Profile image (with fallback)
  - Name
  - Known for department badge
  - Top 2-3 known works (from `known_for` array in search results)
- Link to `/person/${id}`
- Hover effects consistent with MovieCard
- Responsive: 2 columns on mobile, 3-4 on tablet, 5-6 on desktop

## 5. Visual Aesthetics
- **Theme**: Maintain the "Cinematic Dark" theme with consistent color palette
- **Animations**:
  - Smooth page transition using `PageTransition` component
  - Fade-in animations for sections as they load
  - Scroll-into-view animations for filmography items
  - Hover effects on interactive elements (cards, social links)
- **Background**:
  - Subtle backdrop blur on header using blurred version of profile image
  - Gradient overlay for better text readability
- **Typography**:
  - Clear hierarchy (h1 for name, h2 for section titles)
  - Readable font sizes for biography text
- **Spacing**: Consistent padding/margins following existing design system
- **Glassmorphism**: Use for biography and info containers

## 6. Edge Cases & Error Handling
- **Missing Data**:
  - No profile image → Show default avatar icon
  - No biography → Display "No biography available"
  - No birthday/birthplace → Hide those fields gracefully
  - No social links → Hide social section entirely
  - Empty filmography → Show "No credits available" message
- **Invalid Person ID**:
  - Show 404 page or error state
  - Provide navigation back to home/previous page
- **API Failures**:
  - Display retry button
  - Log errors for debugging
  - Maintain loading state until error is confirmed
- **Long Names**: Handle text overflow with ellipsis or line breaks
- **Special Characters**: Properly encode/decode names with accents and symbols

## 7. Performance Optimizations
- **Code Splitting**: Lazy load PersonPage component in router
- **Image Optimization**:
  - Use TMDB's responsive image URLs (w185, w300, w500)
  - Lazy load images below the fold
  - Add loading="lazy" attribute to images
- **Data Fetching**:
  - Consider parallel fetching of details and credits
  - Cache API responses (check if already implemented)
- **Filmography Rendering**:
  - Initial render: Show first 20 credits
  - Implement "Load More" button for 50+ credits
  - Consider virtual scrolling for 100+ credits (optional)
- **Debouncing**: Debounce filter/sort actions if implemented with search

## 8. SEO & Meta Tags
- **Dynamic Page Title**: `{person.name} - Movies & Biography | Moviq`
- **Meta Description**: First 150 chars of biography or "Learn about {name}, explore their movies, TV shows, and career highlights"
- **Open Graph Tags**:
  - og:title, og:description, og:image (profile photo)
  - og:type: "profile"
- **Structured Data**: Consider Person schema markup for better SEO
- **Canonical URL**: Set proper canonical URL for person pages

## 9. Mobile Responsiveness
- **Header**: Stack profile image and info vertically on mobile
- **Personal Info**: Convert sidebar to full-width section on mobile
- **Filmography**: Single column list on mobile, grid on tablet/desktop
- **Touch Interactions**: Ensure tap targets are at least 44x44px
- **Carousel**: Ensure smooth swipe gestures on touch devices
- **Navigation**: Easy access to back button or breadcrumbs

## 10. Implementation Phases

### **Phase 1: Foundation** (Data & Routing)
**Priority: High**
- Create person-related hooks in `useMovies.js`:
  - `usePersonDetails(id)`
  - `usePersonCredits(id)`
  - `usePersonImages(id)` (optional)
- Add route in `Routes.jsx`: `/person/:id`
- Test hooks with sample person IDs (e.g., Tom Hanks: 31, Scarlett Johansson: 1245)

### **Phase 2: Core Page Structure** (MVP)
**Priority: High**
- Create `PersonPage.jsx` with basic layout
- Implement loading and error states
- Build header section:
  - Profile image with fallback
  - Name, age, department
- Add biography section with "Read More" toggle
- Personal info sidebar/section
- Test with various person IDs

### **Phase 3: Filmography** (Key Feature)
**Priority: High**
- Build "Known For" carousel using existing components
- Create filmography section:
  - Display cast and crew credits
  - Show character/job names and years
  - Implement decade grouping
- Add filter tabs (All/Cast/Crew)
- Implement "Load More" for extensive filmographies

### **Phase 4: Navigation & Integration** (Connectivity)
**Priority: Medium**
- Update `CastCard.jsx` to link to person pages
- Ensure proper click handling and hover effects
- Test navigation from movie/TV pages to person pages
- Verify back navigation works correctly

### **Phase 5: Search Integration** (Discovery)
**Priority: Medium**
- Update `SearchPage.jsx` to handle person results
- Create `PersonCard.jsx` component
- Test mixed search results (movies, TV, people)
- Ensure proper linking from search to person page

### **Phase 6: Polish & Enhancement** (UX)
**Priority: Low**
- Add social media links (Instagram, Twitter, IMDb)
- Implement smooth animations and transitions
- Add backdrop blur effect on header
- Fine-tune responsive design
- Optimize images and performance

### **Phase 7: SEO & Metadata** (Optional)
**Priority: Low**
- Add dynamic meta tags (title, description, og tags)
- Implement structured data (Person schema)
- Test with SEO tools
- Add canonical URLs

## 11. Technical Notes & API Details

### **TMDB API Endpoints Reference**
```
GET /person/{person_id}
GET /person/{person_id}/combined_credits
GET /person/{person_id}/images
GET /person/{person_id}/external_ids (for social links)
```

### **Key API Response Fields**
**Person Details:**
- `name`, `biography`, `birthday`, `deathday`, `place_of_birth`
- `profile_path` (image)
- `known_for_department`, `gender`, `popularity`

**Combined Credits:**
- `cast[]`: Array of movies/TV where person acted
  - Each has: `id`, `title/name`, `character`, `release_date/first_air_date`, `media_type`, `popularity`
- `crew[]`: Array of movies/TV where person was crew
  - Each has: `id`, `title/name`, `job`, `department`, `release_date/first_air_date`, `media_type`

**External IDs (Social Links):**
- `imdb_id`, `instagram_id`, `twitter_id`, `facebook_id`
- Build URLs:
  - IMDb: `https://www.imdb.com/name/${imdb_id}`
  - Instagram: `https://www.instagram.com/${instagram_id}`
  - Twitter: `https://twitter.com/${twitter_id}`

### **Image URLs**
- Profile images: `https://image.tmdb.org/t/p/{size}/{profile_path}`
- Recommended sizes: w185 (thumbnail), w300 (card), w500 (detail page)

### **Data Processing Tips**
- **Age Calculation**: `Math.floor((new Date() - new Date(birthday)) / 31557600000)`
- **Sort Credits**: By `release_date` or `first_air_date` (handle nulls)
- **Filter Empty**: Remove credits without titles or release dates
- **Decade Grouping**: `Math.floor(year / 10) * 10` (e.g., 2024 → 2020s)

### **Component Dependencies**
- `PageTransition` - Already exists
- `Loader` - Already exists
- `Carousel` - Already exists
- `MovieCard` - Already exists (will need to handle person credits data)
- `CastCard` - Already exists (needs linking update)
- `PersonCard` - **New component needed**

### **Styling References**
- Follow existing patterns in `SinglePage.jsx` and `TVSinglePage.jsx`
- Use Tailwind utility classes for consistency
- Reference glassmorphism styles from existing components
- Maintain dark theme color scheme

## 12. Success Criteria
- ✅ User can click on any cast member from a Movie/TV page and navigate to their dedicated page
- ✅ Person page displays comprehensive biography and personal information
- ✅ Filmography shows both Movies and TV shows they appeared in with character/job names
- ✅ Social links work and open in new tabs securely
- ✅ Page loads smoothly with proper loading states
- ✅ Error states are handled gracefully (404, API failures, missing data)
- ✅ Search functionality includes people and links to person pages
- ✅ "Known For" carousel displays their most popular works
- ✅ Page is fully responsive across mobile, tablet, and desktop
- ✅ Performance is optimized for persons with extensive filmographies
- ✅ SEO meta tags are properly implemented for better discoverability

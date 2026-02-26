# Moviq Movie App - UX Refined Plan

This document outlines the identified UX discrepancies and the proposed fixes to ensure a consistent, premium user experience.

## 1. Interaction & Feedback ✅ (Priority: High)

### Cursor Consistency
Buttons and interactive elements must show the `cursor: pointer` property to signify they are clickable.

- [ ] **Global Button Fix**: Update `src/components/ui/button.jsx` to include `cursor-pointer` in all variants.
- [ ] **Theme Toggle**: Update `src/components/ui/ThemeToggle.jsx` to include `cursor-pointer`.
- [ ] **Carousel Controls**: Ensure `CarouselPrevious` and `CarouselNext` in `src/components/ui/carousel.jsx` inherit the pointer cursor from the button component.
- [ ] **Cards & Links**: Ensure all `Link` components and custom card hover states maintain the pointer cursor.

---

## 2. Navigation & Layout 🏗️ (Priority: Medium)

### Mobile Touch Targets
Small buttons (like the Search icon or Theme toggle) can be difficult to hit on mobile.

- [ ] Increase the hit area for `ThemeToggle` and Mobile Navbar items without affecting the visual size (using padding).
- [ ] Ensure `CarouselPrevious` and `CarouselNext` are easily tappable on tablets.

### Search Experience
- [ ] **Debounce Feedback**: Show a small spinner/loader inside the search input while the user is typing to indicate that the search is "working".
- [ ] **Empty States**: Enhance the empty state illustrations to be more cinematic.

---

## 3. Visual Polish ✨ (Priority: Low)

### Image Loading
- [ ] **Image Transitions**: Implement a "fade-in" effect for posters and backdrops once they finish loading to prevent the "pop-in" effect.
- [ ] **Placeholder Standard**: Ensure `clapperboard.jpg` and `avatar.jpg` are used consistently for missing media.

---

## 4. Proposed Fix List (Actionable)

1. **Refactor `button.jsx`**: Add `cursor-pointer` to `buttonVariants`.
2. **Refactor `ThemeToggle.jsx`**: Add `cursor-pointer` to the main `motion.button`.
3. **Refactor `CastCard.jsx`**: Add `cursor-default` (to avoid confusion) or `cursor-pointer` if we plan to add "Cast Detail" pages.
4. **Update `Carousel` components**: Review horizontal padding on mobile to ensure content isn't cut off by the screen edge.

---

## ✅ Vision
Every interaction should feel deliberate and responsive. By standardizing pointers and hit areas, we remove friction and make the app feel like a native, premium platform.

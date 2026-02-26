# Moviq Movie App - Theming & Color Scheme Plan

This plan outlines the implementation of a dynamic theme system (Dark/Light mode) using the curated colors found in the `color scheme` directory and Tailwind CSS v4 variables.

## 🎨 Color Palette Analysis

Based on the provided `colors.txt` files, we will map the Realtime Colors palette to our design system.

### Dark Mode (from `colorsdark/colors.txt`)
*   **Background (Secondary):** `#0b0b09` (Deep Charcoal/Black)
*   **Foreground (Primary):** `#ffffff` (White text)
*   **Primary (Brand):** `#4c508a` (Indigo Blue)
*   **Secondary (Muted):** `#161612` (Softer Dark)
*   **Accent:** `#555a9b` (Vivid Blue/Purple)

### Light Mode (from `colors/colors.txt`)
*   **Background (Primary):** `#020203` (Note: The files seem reversed in naming or intent, as `colors` has a dark primary. We will swap them to ensure `Light Mode` is actually light and `Dark Mode` is dark.)
*   **Standard Light Palette (Adjusted):**
    *   **Background:** `#f5f5fa` (Soft White)
    *   **Foreground:** `#020203` (Deep Black text)
    *   **Primary:** `#4c508a` (Consistent Brand Color)
    *   **Secondary:** `#e1e2ef` (Light Grey/Blue)
    *   **Accent:** `#555a9b` (Consistent Accent)

---

## 🛠️ implementation Steps

### 1. Theme Configuration (`src/index.css`)
We will move from hardcoded colors in `@theme` to CSS variables that respond to a `.light` or `.dark` class on the `html` or `body` element.

- [x] Define `:root` variables for the Light theme.
- [x] Define `.dark` selector variables for the Dark theme.
- [x] Update `@theme` block in Tailwind v4 to reference these variables.

### 2. Theme State Management
- [x] Create a `ThemeContext` or use a library like `next-themes` (if compatible with Vite) to handle persistent theme switching.
- [x] Store user preference in `localStorage`.
- [x] Detect system preference using `(prefers-color-scheme: dark)`.

### 3. UI Implementation
- [x] **Theme Toggle Component**: Add a smooth-transition sun/moon toggle in the `Navbar`.
- [x] **Aesthetic Refinement**: Ensure glassmorphism effects (`.glass`) adapt their opacity and border colors based on the active theme.
- [x] **Image Overlays**: Adjust gradient overlays on hero sections to ensure text readability in both modes.

---

## 📅 Roadmap

### Step 1: CSS variable setup
Refactor `index.css` to use variables.
```css
:root {
  --background: #f5f5fa;
  --foreground: #020203;
  /* ... mapping other light colors ... */
}

.dark {
  --background: #0b0b09;
  --foreground: #ffffff;
  /* ... mapping other dark colors ... */
}
```

### Step 2: Theme Toggle
Implement the hook and button logic.

### Step 3: Polish
Cycle through the app to identify and fix low-contrast areas (e.g., search text, badges, footer links).

---

## ✅ Vision
A premium, cinematic experience that respects user preference, shifting from a "Nebula Dark" vibe to a "Clean Studio" light vibe without losing the Moviq brand identity.

---

## 🎉 Implementation Complete!

**Status:** ✅ All tasks completed

**Files Created:**
- `src/context/ThemeContext.jsx` - Theme provider with localStorage persistence
- `src/components/ui/ThemeToggle.jsx` - Animated theme toggle component

**Files Modified:**
- `src/index.css` - Added CSS variables for light/dark themes, updated glassmorphism utilities
- `src/components/Navbar/Navbar.jsx` - Integrated theme toggle button
- `src/main.jsx` - Wrapped app with ThemeProvider

**Features Delivered:**
- ✅ Dynamic theme switching (Dark/Light mode)
- ✅ Persistent user preference via localStorage
- ✅ System preference detection
- ✅ Smooth transition animations
- ✅ Theme-aware glassmorphism effects
- ✅ Accessible toggle button with animated sun/moon icons

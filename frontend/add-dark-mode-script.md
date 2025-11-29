# Dark Mode Implementation Guide

## Completed:
✅ index.html - Fully updated with dark mode classes and theme toggle

## Theme System Files Created:
✅ src/context/ThemeContext.jsx - React Context for theme management
✅ src/components/ThemeToggle.jsx - Toggle switch component
✅ public/theme.js - Global theme management for HTML pages
✅ tailwind.config.js - Updated with darkMode: 'class'
✅ src/index.css - Updated with dark mode transitions
✅ src/main.jsx - Wrapped with ThemeProvider

## Remaining Pages to Update:
Each page needs:

### 1. Theme Init Script in `<head>`:
```html
<script>
    (function() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.add(theme);
    })();
</script>
```

### 2. Theme Toggle Button (add after search bar in navbar):
```html
<!-- Theme Toggle Button -->
<button data-theme-toggle class="w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors relative">
    <span data-toggle-track class="absolute inset-1 bg-white dark:bg-gray-900 w-6 h-6 rounded-full transition-transform duration-300 transform dark:translate-x-6 flex items-center justify-center">
        <span data-toggle-icon></span>
    </span>
</button>
```

### 3. Load theme.js before closing `</body>`:
```html
<script src="/theme.js"></script>
```

### 4. Dark Mode Classes Pattern:
- `bg-white` → `bg-white dark:bg-gray-800` or `dark:bg-gray-900`
- `bg-gray-50` → `bg-gray-50 dark:bg-gray-800`
- `bg-gray-100` → `bg-gray-100 dark:bg-gray-700`
- `text-gray-900` → `text-gray-900 dark:text-white`
- `text-gray-700` → `text-gray-700 dark:text-gray-300`
- `text-gray-600` → `text-gray-600 dark:text-gray-400`
- `text-gray-500` → `text-gray-500 dark:text-gray-400`
- `border-gray-200` → `border-gray-200 dark:border-gray-700`
- `border-gray-300` → `border-gray-300 dark:border-gray-600`
- Add `transition-colors` to elements with dark: variants

## Pages Status:
- [ ] Browse.html
- [ ] dashboard-page.html
- [ ] about-page.html
- [ ] profile-page.html
- [ ] admin-dashboard.html
- [ ] signin-page.html
- [ ] signup-page.html
- [ ] MovieDetails.html
- [ ] form-page.html

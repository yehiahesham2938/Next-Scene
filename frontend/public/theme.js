/**
 * Global Theme Script for HTML Pages
 * This script synchronizes dark mode across all HTML pages
 * Works independently from React components
 */

(function() {
    'use strict';

    // Initialize theme immediately (prevents flash)
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(savedTheme);
        return savedTheme;
    }

    // Set theme and persist
    function setTheme(newTheme) {
        if (newTheme !== 'light' && newTheme !== 'dark') {
            newTheme = 'light';
        }

        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);

        // Update all toggle buttons on page
        updateToggleButtons(newTheme);

        return newTheme;
    }

    // Toggle between light and dark
    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        return setTheme(newTheme);
    }

    // Update all toggle buttons
    function updateToggleButtons(theme) {
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        toggles.forEach(toggle => {
            const track = toggle.querySelector('[data-toggle-track]');
            const icon = toggle.querySelector('[data-toggle-icon]');

            if (track) {
                if (theme === 'dark') {
                    track.classList.add('translate-x-7');
                    track.classList.remove('translate-x-1');
                } else {
                    track.classList.add('translate-x-1');
                    track.classList.remove('translate-x-7');
                }
            }

            if (icon) {
                icon.innerHTML = theme === 'dark' ? getMoonIcon() : getSunIcon();
            }
        });
    }

    // Icon SVGs
    function getSunIcon() {
        return `<svg class="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
    </svg>`;
    }

    function getMoonIcon() {
        return `<svg class="h-4 w-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>`;
    }

    // Listen for storage changes (cross-tab sync)
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme' && e.newValue) {
            setTheme(e.newValue);
        }
    });

    // Listen for theme changes from React
    window.addEventListener('themeChange', function(e) {
        if (e.detail && e.detail.theme) {
            updateToggleButtons(e.detail.theme);
        }
    });

    // Initialize on load
    const currentTheme = initTheme();

    // Setup toggle buttons when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupToggleButtons();
        });
    } else {
        setupToggleButtons();
    }

    function setupToggleButtons() {
        const theme = localStorage.getItem('theme') || 'light';
        updateToggleButtons(theme);

        // Add click handlers
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', toggleTheme);
        });
    }

    // Expose to window for debugging
    window.themeManager = {
        init: initTheme,
        set: setTheme,
        toggle: toggleTheme,
        get: () => localStorage.getItem('theme') || 'light'
    };
})();
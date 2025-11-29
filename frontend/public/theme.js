/**
 * Global Theme Script for HTML Pages
 * This script synchronizes dark mode across all HTML pages
 * Works independently from React components
 */

(function() {
    'use strict';

    // Initialize theme immediately (prevents flash)
    function initTheme() {
        let savedTheme = localStorage.getItem('theme');
        // Normalize theme value - ensure it's either 'light' or 'dark'
        if (savedTheme) {
            savedTheme = savedTheme.trim().toLowerCase();
            if (savedTheme !== 'light' && savedTheme !== 'dark') {
                savedTheme = 'light';
            }
        } else {
            savedTheme = 'light';
        }
        // Remove any existing theme classes first
        document.documentElement.classList.remove('light', 'dark');
        // Add the theme class
        document.documentElement.classList.add(savedTheme);
        // Ensure localStorage is set correctly
        if (localStorage.getItem('theme') !== savedTheme) {
            localStorage.setItem('theme', savedTheme);
        }
        return savedTheme;
    }

    // Set theme and persist
    function setTheme(newTheme) {
        // Normalize theme value
        if (newTheme) {
            newTheme = newTheme.trim().toLowerCase();
        }
        if (newTheme !== 'light' && newTheme !== 'dark') {
            newTheme = 'light';
        }

        // Remove any existing theme classes and add the new one
        const html = document.documentElement;
        
        // Remove both classes first
        html.classList.remove('light', 'dark');
        
        // Add the new theme class
        html.classList.add(newTheme);
        
        // Also set as attribute for CSS targeting
        html.setAttribute('data-theme', newTheme);
        
        // Save to localStorage
        localStorage.setItem('theme', newTheme);

        // Force a reflow to ensure styles are recalculated
        void html.offsetHeight;
        
        // Dispatch a custom event for any listeners
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));

        // Update all toggle buttons on page
        updateToggleButtons(newTheme);

        // Debug logging
        console.log('✅ Theme changed to:', newTheme);
        console.log('✅ HTML element classes:', html.className);
        console.log('✅ localStorage theme:', localStorage.getItem('theme'));
        console.log('✅ Has dark class:', html.classList.contains('dark'));
        console.log('✅ Has light class:', html.classList.contains('light'));
        
        // Check if CSS is loaded
        const stylesheets = Array.from(document.styleSheets);
        const tailwindLoaded = stylesheets.some(sheet => {
            try {
                return sheet.href && (sheet.href.includes('profile-page.css') || sheet.href.includes('index.css') || sheet.href.includes('tailwind'));
            } catch {
                return false;
            }
        });
        console.log('✅ Tailwind CSS loaded:', tailwindLoaded);
        console.log('✅ Stylesheets count:', stylesheets.length);

        return newTheme;
    }

    // Toggle between light and dark
    function toggleTheme() {
        console.log('🔄 toggleTheme() called');
        
        // Get current theme from localStorage (source of truth)
        let currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            currentTheme = currentTheme.trim().toLowerCase();
        }
        if (currentTheme !== 'light' && currentTheme !== 'dark') {
            currentTheme = 'light';
        }
        
        // If no theme in localStorage, check DOM
        if (!currentTheme) {
            const htmlElement = document.documentElement;
            const hasDark = htmlElement.classList.contains('dark');
            const hasLight = htmlElement.classList.contains('light');
            
            if (hasDark) {
                currentTheme = 'dark';
            } else if (hasLight) {
                currentTheme = 'light';
            } else {
                currentTheme = 'light';
            }
        }
        
        console.log('📊 Current theme:', currentTheme);
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('📊 Switching to:', newTheme);
        
        return setTheme(newTheme);
    }

    // Update all toggle buttons
    function updateToggleButtons(theme) {
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        console.log('🎨 updateToggleButtons called with theme:', theme, 'Found', toggles.length, 'toggles');
        
        toggles.forEach((toggle, index) => {
            const track = toggle.querySelector('[data-toggle-track]');
            const icon = toggle.querySelector('[data-toggle-icon]');

            if (track) {
                // Remove all possible left/right positioning classes
                const allLeftClasses = ['left-0', 'left-1', 'left-2', 'left-3', 'left-4', 'left-5', 'left-6', 'left-7', 'left-8', 'left-auto'];
                const allRightClasses = ['right-0', 'right-1', 'right-2', 'right-3', 'right-4', 'right-5', 'right-6', 'right-7', 'right-8', 'right-auto'];
                track.classList.remove(...allLeftClasses, ...allRightClasses);
                
                if (theme === 'dark') {
                    // Move to rightmost: w-14 (56px) - w-6 (24px) = 32px = left-8 (2rem)
                    // This positions the track at the right edge
                    track.classList.add('left-8');
                    console.log('🌙 Toggle', index, '- Set to dark mode (left-8 = 32px)');
                } else {
                    // Move to leftmost: left-1 (4px padding = 0.25rem)
                    track.classList.add('left-1');
                    console.log('☀️ Toggle', index, '- Set to light mode (left-1 = 4px)');
                }
                
                // Force a reflow to ensure the class change is applied
                void track.offsetWidth;
            } else {
                console.warn('⚠️ Toggle', index, '- No track element found');
            }

            if (icon) {
                icon.innerHTML = theme === 'dark' ? getMoonIcon() : getSunIcon();
                console.log('🎯 Toggle', index, '- Icon updated');
            } else {
                console.warn('⚠️ Toggle', index, '- No icon element found');
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

    // Listen for theme changes from React or other sources
    window.addEventListener('themeChange', function(e) {
        if (e.detail && e.detail.theme) {
            setTheme(e.detail.theme);
        }
    });

    // Initialize on load
    initTheme();

    // Setup toggle buttons when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupToggleButtons();
            // Final check to ensure theme matches localStorage
            enforceTheme();
        });
    } else {
        setupToggleButtons();
        // Final check to ensure theme matches localStorage
        enforceTheme();
    }

    // Enforce theme from localStorage (ensures consistency)
    function enforceTheme() {
        let savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            savedTheme = savedTheme.trim().toLowerCase();
            if (savedTheme !== 'light' && savedTheme !== 'dark') {
                savedTheme = 'light';
            }
        } else {
            savedTheme = 'light';
        }
        
        const htmlElement = document.documentElement;
        const hasDark = htmlElement.classList.contains('dark');
        const hasLight = htmlElement.classList.contains('light');
        
        // If theme doesn't match localStorage, fix it
        if (savedTheme === 'light' && hasDark) {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
            updateToggleButtons('light');
        } else if (savedTheme === 'dark' && hasLight) {
            htmlElement.classList.remove('light');
            htmlElement.classList.add('dark');
            updateToggleButtons('dark');
        } else if (!hasDark && !hasLight) {
            // No theme class, add the correct one
            htmlElement.classList.add(savedTheme);
            updateToggleButtons(savedTheme);
        } else {
            // Theme matches, but ensure toggles are updated
            updateToggleButtons(savedTheme);
        }
    }

    function setupToggleButtons() {
        // Get current theme
        let theme = localStorage.getItem('theme');
        if (theme) {
            theme = theme.trim().toLowerCase();
            if (theme !== 'light' && theme !== 'dark') {
                theme = 'light';
            }
        } else {
            theme = 'light';
        }
        
        // Update toggle buttons immediately
        updateToggleButtons(theme);
        
        // Also update after a small delay to ensure DOM is fully ready
        setTimeout(() => {
            updateToggleButtons(theme);
        }, 100);

        // Add click handlers - use event delegation to avoid issues with cloning
        document.addEventListener('click', function(e) {
            const toggle = e.target.closest('[data-theme-toggle]');
            if (toggle) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Toggle button clicked!');
                toggleTheme();
            }
        });
        
        // Also add direct listeners as backup
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        console.log('🔘 Found', toggles.length, 'toggle button(s)');
        toggles.forEach((toggle, index) => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Toggle button', index, 'clicked (direct listener)!');
                toggleTheme();
            });
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
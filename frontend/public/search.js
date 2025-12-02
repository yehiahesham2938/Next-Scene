// Autocomplete cache
let moviesCache = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch movies for autocomplete
async function fetchMoviesForAutocomplete() {
    const now = Date.now();
    if (moviesCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
        return moviesCache;
    }

    try {
        const response = await fetch('http://localhost:4000/api/movies');
        if (response.ok) {
            moviesCache = await response.json();
            cacheTimestamp = now;
            return moviesCache;
        }
    } catch (error) {
        console.error('Error fetching movies for autocomplete:', error);
    }
    return [];
}

// Create autocomplete dropdown
function createAutocompleteDropdown(input) {
    const existingDropdown = input.parentElement.querySelector('.autocomplete-dropdown');
    if (existingDropdown) {
        return existingDropdown;
    }

    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 hidden';
    dropdown.style.maxHeight = '320px';

    // Ensure parent has relative positioning
    if (input.parentElement.style.position !== 'relative') {
        input.parentElement.style.position = 'relative';
    }

    input.parentElement.appendChild(dropdown);
    return dropdown;
}

// Show autocomplete suggestions
async function showAutocompleteSuggestions(input, query) {
    if (!query || query.length < 2) {
        hideAutocomplete(input);
        return;
    }

    const movies = await fetchMoviesForAutocomplete();
    const dropdown = createAutocompleteDropdown(input);

    // Filter movies based on query
    const queryLower = query.toLowerCase();
    const matches = movies.filter(movie => {
        const title = (movie.title || '').toLowerCase();
        const genres = (movie.genre || '').toLowerCase();
        const director = (movie.director || '').toLowerCase();
        const cast = (movie.cast || []).join(' ').toLowerCase();

        return title.includes(queryLower) ||
            genres.includes(queryLower) ||
            director.includes(queryLower) ||
            cast.includes(queryLower);
    }).slice(0, 8); // Limit to 8 results

    if (matches.length === 0) {
        dropdown.innerHTML = '<div class="p-3 text-sm text-gray-500 dark:text-gray-400">No results found</div>';
        dropdown.classList.remove('hidden');
        return;
    }

    // Build dropdown HTML
    dropdown.innerHTML = matches.map(movie => {
                const title = movie.title || 'Untitled';
                const year = movie.releaseYear || '';
                const rating = movie.rating != null ? movie.rating : '';
                const poster = movie.poster || 'img/image1tst.png';
                const genres = (movie.genre || '').split(',').slice(0, 2).join(', ');
                const movieId = movie._id;

                return `
            <a href="MovieDetails.html?id=${encodeURIComponent(movieId)}" 
               class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <img src="${poster}" alt="${title}" class="w-12 h-16 object-cover rounded flex-shrink-0" onerror="this.src='img/image1tst.png'">
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm text-gray-900 dark:text-white truncate">${title}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">${year}${genres ? ' • ' + genres : ''}</p>
                    ${rating ? `<div class="flex items-center gap-1 mt-1">
                        <i class="fas fa-star text-yellow-500 text-xs"></i>
                        <span class="text-xs text-gray-600 dark:text-gray-300">${rating}</span>
                    </div>` : ''}
                </div>
            </a>
        `;
    }).join('');

    dropdown.classList.remove('hidden');
}

// Hide autocomplete dropdown
function hideAutocomplete(input) {
    const dropdown = input.parentElement.querySelector('.autocomplete-dropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
    }
}

// Setup autocomplete for an input
function setupAutocomplete(input) {
    let autocompleteTimeout;

    // Input event for autocomplete
    input.addEventListener('input', (e) => {
        clearTimeout(autocompleteTimeout);
        const query = e.target.value.trim();
        
        if (query.length >= 2) {
            autocompleteTimeout = setTimeout(() => {
                showAutocompleteSuggestions(input, query);
            }, 300);
        } else {
            hideAutocomplete(input);
        }
    });

    // Hide on blur (with delay to allow clicking on suggestions)
    input.addEventListener('blur', () => {
        setTimeout(() => hideAutocomplete(input), 200);
    });

    // Show on focus if there's already a value
    input.addEventListener('focus', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            showAutocompleteSuggestions(input, query);
        }
    });

    // Handle keyboard navigation
    input.addEventListener('keydown', (e) => {
        const dropdown = input.parentElement.querySelector('.autocomplete-dropdown');
        if (!dropdown || dropdown.classList.contains('hidden')) return;

        const items = dropdown.querySelectorAll('a');
        if (items.length === 0) return;

        let currentIndex = -1;
        items.forEach((item, index) => {
            if (item.classList.contains('bg-gray-100') || item.classList.contains('dark:bg-gray-600')) {
                currentIndex = index;
            }
        });

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            items.forEach(item => {
                item.classList.remove('bg-gray-100', 'dark:bg-gray-600');
            });
            const nextIndex = (currentIndex + 1) % items.length;
            items[nextIndex].classList.add('bg-gray-100', 'dark:bg-gray-600');
            items[nextIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            items.forEach(item => {
                item.classList.remove('bg-gray-100', 'dark:bg-gray-600');
            });
            const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
            items[prevIndex].classList.add('bg-gray-100', 'dark:bg-gray-600');
            items[prevIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            items[currentIndex].click();
        } else if (e.key === 'Escape') {
            hideAutocomplete(input);
        }
    });
}

// Global search functionality for redirecting to Browse page
function initializeGlobalSearch() {
    // Find all search inputs across the site
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"], input[placeholder*="search"]');
    
    searchInputs.forEach(input => {
        // Skip if it's already been initialized
        if (input.dataset.searchInitialized) {
            return;
        }
        
        input.dataset.searchInitialized = 'true';
        
        // Setup autocomplete for all search inputs
        setupAutocomplete(input);
        
        // Handle Enter key for non-Browse page inputs
        if (input.id !== 'desktop-header-search' && 
            input.id !== 'mobile-search' && 
            input.id !== 'desktop-main-search') {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchQuery = e.target.value.trim();
                    if (searchQuery) {
                        // Redirect to Browse page with search parameter
                        window.location.href = `Browse.html?search=${encodeURIComponent(searchQuery)}`;
                    }
                }
            });
        }
        
        // Add search icon click handler if there's a parent with search icon
        const parentDiv = input.closest('.relative');
        if (parentDiv) {
            const searchIcon = parentDiv.querySelector('svg, button, .fa-search');
            if (searchIcon && input.id !== 'desktop-header-search' && 
                input.id !== 'mobile-search' && 
                input.id !== 'desktop-main-search') {
                searchIcon.style.cursor = 'pointer';
                searchIcon.addEventListener('click', () => {
                    const searchQuery = input.value.trim();
                    if (searchQuery) {
                        window.location.href = `Browse.html?search=${encodeURIComponent(searchQuery)}`;
                    }
                });
            }
        }
    });

    // Pre-fetch movies cache on page load
    fetchMoviesForAutocomplete();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGlobalSearch);
} else {
    initializeGlobalSearch();
}
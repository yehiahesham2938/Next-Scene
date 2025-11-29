// Watchlist Management Logic

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    initializeWatchlist();
});

function initializeWatchlist() {
    // Check if we are on a movie details page to update the "Add" button state
    const movieTitle = document.querySelector('h1')?.textContent;
    if (movieTitle && document.getElementById('addToWatchlistBtn')) {
        checkMovieInWatchlist(movieTitle.trim());
    }

    // Check if we are on the watchlist page to render items
    if (document.getElementById('watchlist-grid')) {
        renderWatchlist('newest-added'); // Default sort
        setupFilterListeners();
    }
}

// --- Core Functionality ---

function addToWatchlist() {
    const movieTitle = (document.querySelector('h1')?.textContent || 'Unknown Title').trim();
    // Try to find poster in multiple common locations
    const moviePoster = document.querySelector('img[alt="Movie Poster"]')?.src ||
        document.querySelector('.aspect-\\[2\\/3\\] img')?.src ||
        'https://via.placeholder.com/300x450?text=No+Poster';

    // Try to find year
    let movieYear = 'N/A';
    const yearElement = document.getElementById('movie-year') ||
        Array.from(document.querySelectorAll('span')).find(el => el.textContent.match(/^\d{4}$/));
    if (yearElement) movieYear = yearElement.textContent;

    // Create movie object
    const movie = {
        title: movieTitle,
        poster: moviePoster,
        year: movieYear,
        addedAt: new Date().toISOString()
    };

    let watchlist = getWatchlist();

    // Check if already exists
    const existingIndex = watchlist.findIndex(m => m.title === movie.title);

    if (existingIndex >= 0) {
        // Remove if exists (toggle behavior)
        watchlist.splice(existingIndex, 1);
        showNotification('Removed from Watchlist', 'error');
        updateButtonState(false);
    } else {
        // Add new
        watchlist.push(movie);
        showNotification('Added to Watchlist', 'success');
        updateButtonState(true);
    }

    saveWatchlist(watchlist);
}

function removeFromWatchlist(title) {
    let watchlist = getWatchlist();
    watchlist = watchlist.filter(m => m.title !== title);
    saveWatchlist(watchlist);

    // Re-render if on watchlist page
    if (document.getElementById('watchlist-grid')) {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.sort || 'newest-added';
        renderWatchlist(activeFilter);
    } else {
        // Update button if on details page
        checkMovieInWatchlist(document.querySelector('h1')?.textContent);
    }
    showNotification('Movie removed', 'success');
}

function getWatchlist() {
    return JSON.parse(localStorage.getItem('watchlist')) || [];
}

function saveWatchlist(watchlist) {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

// --- UI Updates ---

function checkMovieInWatchlist(title) {
    const watchlist = getWatchlist();
    const exists = watchlist.some(m => m.title === title);
    updateButtonState(exists);
}

function updateButtonState(exists) {
    const btn = document.getElementById('addToWatchlistBtn');
    const btnMobile = document.getElementById('addToWatchlistBtnMobile'); // If you have a mobile specific button

    if (btn) {
        if (exists) {
            btn.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
            btn.classList.remove('bg-black', 'dark:bg-white', 'text-white', 'dark:text-black');
            btn.classList.add('bg-green-600', 'text-white');
        } else {
            btn.innerHTML = '<i class="far fa-heart"></i> Add to Watchlist';
            btn.classList.add('bg-black', 'dark:bg-white', 'text-white', 'dark:text-black');
            btn.classList.remove('bg-green-600');
        }
    }
}

// --- Watchlist Page Rendering ---

function setupFilterListeners() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            buttons.forEach(b => {
                b.classList.remove('bg-black', 'text-white', 'active');
                b.classList.add('bg-gray-200', 'text-gray-800');
            });
            // Add active class to clicked
            e.target.classList.remove('bg-gray-200', 'text-gray-800');
            e.target.classList.add('bg-black', 'text-white', 'active');

            renderWatchlist(e.target.dataset.sort);
        });
    });
}

function renderWatchlist(sortBy) {
    const grid = document.getElementById('watchlist-grid');
    const emptyState = document.getElementById('empty-state');
    let movies = getWatchlist();

    if (movies.length === 0) {
        grid.innerHTML = '';
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    // Sorting Logic
    movies.sort((a, b) => {
        if (sortBy === 'newest-added') {
            return new Date(b.addedAt) - new Date(a.addedAt);
        } else if (sortBy === 'oldest-added') {
            return new Date(a.addedAt) - new Date(b.addedAt);
        } else if (sortBy === 'release-date') {
            return parseInt(b.year || 0) - parseInt(a.year || 0);
        }
        return 0;
    });

    grid.innerHTML = movies.map(movie => `
        <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative">
            <div class="relative aspect-[2/3] overflow-hidden">
                <img src="${movie.poster}" alt="${movie.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button onclick="removeFromWatchlist('${movie.title.replace(/'/g, "\\'")}')" class="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-gray-900 dark:text-white truncate mb-1 text-lg">${movie.title}</h3>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400 text-sm">${movie.year}</span>
                    <span class="text-xs text-gray-400 dark:text-gray-500">Added ${new Date(movie.addedAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// --- Notification ---

function showNotification(message, type = 'success') {
    const div = document.createElement('div');
    div.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white transform transition-all duration-300 translate-y-20 z-50 flex items-center gap-2 shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`;
    div.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(div);

    // Animate in
    requestAnimationFrame(() => {
        div.classList.remove('translate-y-20');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        div.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

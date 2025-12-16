// Watchlist Management Logic

// Make API_BASE_URL available globally to avoid redeclaration errors
if (typeof window !== 'undefined' && !window.API_BASE_URL) {
    window.API_BASE_URL = 'http://localhost:4000';
}
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:4000';

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
        setupSearch();
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

async function removeFromWatchlistById(id) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id || user?._id;
        if (user && userId) {
            // Try to remove from database
            const response = await fetch(`${API_BASE_URL}/api/watchlist?userId=${userId}`);
            if (response.ok) {
                const items = await response.json();
                const item = items.find(i => (i.movieId?._id || i.movieId) === id);
                if (item) {
                    const deleteResponse = await fetch(`${API_BASE_URL}/api/watchlist/${item._id}?userId=${userId}`, {
                        method: 'DELETE'
                    });
                    if (deleteResponse.ok) {
                        showNotification('Movie removed', 'success');
                        // Re-render if on watchlist page
                        if (document.getElementById('watchlist-grid')) {
                            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.sort || 'newest-added';
                            const searchQuery = document.getElementById('watchlist-search')?.value || '';
                            renderWatchlist(activeFilter, searchQuery);
                        }
                        return;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error removing from database, falling back to localStorage:', error);
    }
    
    // Fallback to localStorage
    let watchlist = getWatchlist();
    watchlist = watchlist.filter(m => m.id !== id);
    saveWatchlist(watchlist);

    // Re-render if on watchlist page
    if (document.getElementById('watchlist-grid')) {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.sort || 'newest-added';
        const searchQuery = document.getElementById('watchlist-search')?.value || '';
        renderWatchlist(activeFilter, searchQuery);
    }
    showNotification('Movie removed', 'success');
}

async function markAsWatched(id) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id || user?._id;
        
        if (user && userId) {
            // Try to update in database
            const response = await fetch(`${API_BASE_URL}/api/watchlist?userId=${userId}`);
            if (response.ok) {
                const items = await response.json();
                const item = items.find(i => (i.movieId?._id || i.movieId) === id);
                
                if (item) {
                    const updateResponse = await fetch(`${API_BASE_URL}/api/watchlist/watched`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            userId: userId,
                            movieId: id,
                            watched: !item.watched // Toggle
                        })
                    });
                    
                    if (updateResponse.ok) {
                        const status = !item.watched ? 'marked as watched' : 'marked as unwatched';
                        showNotification(`Movie ${status}`, 'success');
                        
                        // Re-render if on watchlist page
                        if (document.getElementById('watchlist-grid')) {
                            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.sort || 'newest-added';
                            const searchQuery = document.getElementById('watchlist-search')?.value || '';
                            renderWatchlist(activeFilter, searchQuery);
                        }
                        return;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error updating watched status in database, falling back to localStorage:', error);
    }
    
    // Fallback to localStorage
    let watchlist = getWatchlist();
    const movieIndex = watchlist.findIndex(m => m.id === id);
    
    if (movieIndex >= 0) {
        watchlist[movieIndex].watched = !watchlist[movieIndex].watched; // Toggle watched status
        saveWatchlist(watchlist);
        
        // Re-render if on watchlist page
        if (document.getElementById('watchlist-grid')) {
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.sort || 'newest-added';
            const searchQuery = document.getElementById('watchlist-search')?.value || '';
            renderWatchlist(activeFilter, searchQuery);
        }
        
        const status = watchlist[movieIndex].watched ? 'marked as watched' : 'marked as unwatched';
        showNotification(`Movie ${status}`, 'success');
    }
}

function markAsWatchedByTitle(title) {
    let watchlist = getWatchlist();
    const movieIndex = watchlist.findIndex(m => m.title === title);
    
    if (movieIndex >= 0) {
        watchlist[movieIndex].watched = !watchlist[movieIndex].watched; // Toggle watched status
        saveWatchlist(watchlist);
        
        // Re-render if on watchlist page
        if (document.getElementById('watchlist-grid')) {
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.sort || 'newest-added';
            renderWatchlist(activeFilter);
        }
        
        const status = watchlist[movieIndex].watched ? 'marked as watched' : 'marked as unwatched';
        showNotification(`Movie ${status}`, 'success');
    }
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
                b.classList.remove('bg-black', 'text-white', 'active', 'dark:bg-gray-700', 'dark:text-white');
                b.classList.add('text-gray-600', 'dark:text-gray-400');
            });
            // Add active class to clicked
            e.target.classList.remove('text-gray-600', 'dark:text-gray-400');
            e.target.classList.add('bg-black', 'text-white', 'active', 'dark:bg-gray-700', 'dark:text-white');

            const searchQuery = document.getElementById('watchlist-search')?.value || '';
            renderWatchlist(e.target.dataset.sort, searchQuery);
        });
    });
}

async function renderWatchlist(sortBy, searchQuery = '') {
    const grid = document.getElementById('watchlist-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!grid || !emptyState) return;

    // Try to load from database first, fallback to localStorage
    let movies = await loadWatchlistFromDB();
    if (!movies || movies.length === 0) {
        // Fallback to localStorage
        movies = getWatchlist();
    }

    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        movies = movies.filter(m => {
            const title = (m.title || m.movieId?.title || '').toLowerCase();
            const year = (m.year || m.movieId?.releaseYear || '').toString();
            return title.includes(query) || year.includes(query);
        });
    }

    if (movies.length === 0) {
        // Show empty state, hide grid
        grid.innerHTML = '';
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        grid.classList.add('hidden');
        return;
    }

    // Show grid, hide empty state
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');

    // Sorting Logic
    movies.sort((a, b) => {
        if (sortBy === 'newest-added') {
            return new Date(b.addedAt) - new Date(a.addedAt);
        } else if (sortBy === 'oldest-added') {
            return new Date(a.addedAt) - new Date(b.addedAt);
        } else if (sortBy === 'release-date') {
            const yearA = parseInt((a.year || a.movieId?.releaseYear || 0));
            const yearB = parseInt((b.year || b.movieId?.releaseYear || 0));
            return yearB - yearA;
        }
        return 0;
    });

    grid.innerHTML = movies.map(movie => {
        // Handle both database format (with movieId) and localStorage format
        const movieId = movie.id || movie.movieId?._id || movie.movieId;
        const title = movie.title || movie.movieId?.title || 'Unknown';
        const poster = movie.poster || movie.movieId?.poster || 'img/image1tst.png';
        const year = movie.year || movie.movieId?.releaseYear || '';
        const addedAt = movie.addedAt || movie.createdAt || new Date().toISOString();
        const isWatched = movie.watched || false;
        
        const movieLink = movieId ? `MovieDetails.html?id=${movieId}` : '#';
        const removeHandler = movieId 
            ? `removeFromWatchlistById('${movieId}')` 
            : `removeFromWatchlist('${title.replace(/'/g, "\\'")}')`;
        const watchedHandler = movieId 
            ? `markAsWatched('${movieId}')` 
            : `markAsWatchedByTitle('${title.replace(/'/g, "\\'")}')`;
        const watchedBadge = isWatched ? '<span class="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><i class="fas fa-check"></i> Watched</span>' : '';
        
        return `
        <a href="${movieLink}" class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative block">
            <div class="relative aspect-[2/3] overflow-hidden">
                <img src="${poster}" alt="${title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                ${watchedBadge}
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                    <button onclick="event.preventDefault(); ${watchedHandler}" class="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 shadow-lg">
                        <i class="fas fa-check-circle"></i> ${isWatched ? 'Watched' : 'Mark as Watched'}
                    </button>
                    <button onclick="event.preventDefault(); ${removeHandler}" class="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 shadow-lg">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-gray-900 dark:text-white truncate mb-1 text-lg">${title}</h3>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400 text-sm">${year}</span>
                    <span class="text-xs text-gray-400 dark:text-gray-500">Added ${new Date(addedAt).toLocaleDateString()}</span>
                </div>
            </div>
        </a>
    `;
    }).join('');
}

// Load watchlist from database
async function loadWatchlistFromDB() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id || user?._id;
        if (!user || !userId) return null;
        
        const response = await fetch(`${API_BASE_URL}/api/watchlist?userId=${userId}`);
        if (!response.ok) return null;
        
        const items = await response.json();
        return items.map(item => ({
            id: item.movieId?._id || item.movieId,
            title: item.movieId?.title,
            poster: item.movieId?.poster || 'img/image1tst.png',
            year: item.movieId?.releaseYear,
            rating: item.movieId?.rating,
            addedAt: item.addedAt || item.createdAt,
            watched: item.watched,
            _id: item._id // Keep watchlist item ID for deletion
        }));
    } catch (error) {
        console.error('Error loading watchlist from DB:', error);
        return null;
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('watchlist-search');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.sort || 'newest-added';
            renderWatchlist(activeFilter, e.target.value);
        }, 300);
    });
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

// API Base URL
const API_BASE_URL = 'http://localhost:4000';

// Check authentication and admin role
window.onload = async function () {
    const user = localStorage.getItem('user');

    // Redirect to sign-in page if user is not signed in
    if (!user) {
        window.location.href = 'signin-page.html';
        return;
    }

    // Parse and check user data
    try {
        const userData = JSON.parse(user);
        console.log('Current user:', userData);

        // Redirect non-admin users to regular index page
        if (userData.role !== 'admin') {
            window.location.href = 'index.html';
            return;
        }
    } catch (e) {
        console.error('Error parsing user data:', e);
        // If data is corrupted, redirect to sign-in
        window.location.href = 'signin-page.html';
        return;
    }

    // Load admin dashboard data
    await loadAdminStats();
    await loadMostWatchlistedMovies();
    await loadUsers();
    await loadGenreStats();

    // Initialize chart colors
    const chartColors = {
        primary: '#1f2937',
        background: 'rgba(31, 41, 55, 0.1)',
        gridColor: '#e5e7eb',
        textColor: '#6b7280'
    };

    // Initialize Users Growth Chart (placeholder data for now)
    const usersGrowthCtx = document.getElementById('usersGrowthChart').getContext('2d');
    const usersGrowthChart = new Chart(usersGrowthCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Users',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: chartColors.primary,
                backgroundColor: chartColors.background,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: chartColors.gridColor
                    },
                    ticks: {
                        color: chartColors.textColor
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: chartColors.textColor
                    }
                }
            }
        }
    });
};

// Load admin statistics from API
async function loadAdminStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
        if (!response.ok) {
            throw new Error('Failed to fetch admin stats');
        }
        const stats = await response.json();
        console.log('Admin stats loaded:', stats);

        // Update stats cards with real data
        document.getElementById('total-users').textContent = stats.totalUsers.toLocaleString();
        document.getElementById('total-movies').textContent = stats.totalMovies.toLocaleString();
        document.getElementById('total-watchlists').textContent = stats.totalWatchlists.toLocaleString();
        document.getElementById('active-users').textContent = stats.adminUsers.toLocaleString();
    } catch (error) {
        console.error('Error loading admin stats:', error);
        // Set to 0 on error
        document.getElementById('total-users').textContent = '0';
        document.getElementById('total-movies').textContent = '0';
        document.getElementById('total-watchlists').textContent = '0';
        document.getElementById('active-users').textContent = '0';
    }
}

// Load most watchlisted movies from API
async function loadMostWatchlistedMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/most-watchlisted?limit=4`);
        if (!response.ok) {
            throw new Error('Failed to fetch most watchlisted movies');
        }
        const movies = await response.json();
        console.log('Most watchlisted movies loaded:', movies);

        // Find the container for movie cards
        const container = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
        if (!container) return;

        // Clear existing placeholder cards
        container.innerHTML = '';

        // If no movies, show a message
        if (movies.length === 0) {
            container.innerHTML = '<p class="col-span-4 text-center text-gray-500">No watchlisted movies yet</p>';
            return;
        }

        // Create cards for each movie
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded overflow-hidden shadow-sm hover:shadow-lg transition';
            card.innerHTML = `
                <div class="w-full h-48 bg-gray-400 flex items-center justify-center text-white overflow-hidden">
                    ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}" class="w-full h-full object-cover" />` : 'Movie Poster'}
                </div>
                <div class="p-4">
                    <h3 class="font-semibold mb-1">${movie.title || 'Untitled'}</h3>
                    <p class="text-gray-500 text-sm mb-2">${movie.releaseYear || 'N/A'}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1 text-yellow-500">
                            ⭐ <span class="text-gray-700 text-sm">${movie.rating || 'N/A'}</span>
                        </div>
                        <span class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Added ${movie.count} times</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading most watchlisted movies:', error);
    }
}

// Load all users from API
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        console.log('Users loaded:', users);

        // Find the table body
        const tableBody = document.getElementById('users-table-body');
        if (!tableBody) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        // If no users, show a message
        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No users found</td></tr>';
            return;
        }

        // Create rows for each user
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <i class="fa-solid fa-user text-gray-600"></i>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${user.fullName}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${user.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}">${user.role}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.watchlistCount || 0}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-blue-600 hover:text-blue-900">View</a>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        const tableBody = document.getElementById('users-table-body');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Failed to load users</td></tr>';
        }
    }
}

// Load genre statistics and update chart
async function loadGenreStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/genre-stats`);
        if (!response.ok) {
            throw new Error('Failed to fetch genre stats');
        }
        const genreStats = await response.json();
        console.log('Genre stats loaded:', genreStats);

        const chartColors = {
            primary: '#1f2937',
            gridColor: '#e5e7eb',
            textColor: '#6b7280'
        };

        // Extract labels and data
        const labels = genreStats.map(g => g.genre);
        const data = genreStats.map(g => g.count);

        // Initialize Genre Chart
        const genreCtx = document.getElementById('genreChart').getContext('2d');
        new Chart(genreCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Movies',
                    data: data,
                    backgroundColor: chartColors.primary,
                    borderColor: chartColors.primary,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: chartColors.gridColor
                        },
                        ticks: {
                            color: chartColors.textColor
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: chartColors.textColor
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading genre stats:', error);
    }
}

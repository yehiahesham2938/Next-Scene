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
    await loadUserGrowthStats();
    await loadUserActivity();
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

        // Find the table body and mobile cards container
        const tableBody = document.getElementById('users-table-body');
        const mobileCards = document.getElementById('users-cards-mobile');

        // Clear existing content
        if (tableBody) tableBody.innerHTML = '';
        if (mobileCards) mobileCards.innerHTML = '';

        // If no users, show a message
        if (users.length === 0) {
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No users found</td></tr>';
            }
            if (mobileCards) {
                tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Failed to load users</td></tr>';
            }
            const mobileCards = document.getElementById('users-cards-mobile');
            if (mobileCards) {
                mobileCards.innerHTML = '<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-red-500">Failed to load users</div>';
            }
        }
        // Create rows for each user
        users.forEach(user => {
            // Format last activity timestamp
            const lastActivity = user.lastActivity ? new Date(user.lastActivity) : null;
            const lastActivityText = lastActivity ? formatRelativeTime(lastActivity) : 'Never';
            const lastActivityColor = getActivityColor(lastActivity);

            // Desktop table row
            if (tableBody) {
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
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lastActivityColor}">${lastActivityText}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <button onclick="toggleRoleMenu(event, '${user.id}')" class="text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none p-2 rounded-full hover:bg-indigo-50" title="Change Role">
                                    <i class="fa-solid fa-user-gear text-lg"></i>
                                </button>
                                <div id="role-menu-${user.id}" class="role-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div class="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Change Role
                                    </div>
                                    <button onclick="updateUserRole('${user.id}', 'admin')" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2">
                                        <i class="fa-solid fa-shield-halved text-xs w-4"></i> Admin
                                    </button>
                                    <button onclick="updateUserRole('${user.id}', 'user')" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2">
                                        <i class="fa-solid fa-user text-xs w-4"></i> User
                                    </button>
                                </div>
                            </div>
                            <button onclick="deleteUser('${user.id}')" class="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50 group relative" title="Delete User">
                                <i class="fa-solid fa-trash-can text-lg"></i>
                                <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">Delete Account</span>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            }

            // Mobile card
            if (mobileCards) {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4';
                card.innerHTML = `
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                <i class="fa-solid fa-user text-gray-600"></i>
                            </div>
                            <div>
                                <div class="text-sm font-medium text-gray-900">${user.fullName}</div>
                                <div class="text-xs text-gray-500 mt-1">${user.email}</div>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-3 border-t border-gray-200 pt-3">
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500">Role</span>
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}">${user.role}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500">Watchlists</span>
                            <span class="text-sm text-gray-900 font-medium">${user.watchlistCount || 0}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500">Last Activity</span>
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lastActivityColor}">${lastActivityText}</span>
                        </div>
                        <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span class="text-xs text-gray-500">Actions</span>
                            <div class="flex items-center gap-3">
                                <div class="relative">
                                    <button onclick="toggleRoleMenuMobile(event, '${user.id}')" class="text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none p-2 rounded-full hover:bg-indigo-50" title="Change Role">
                                        <i class="fa-solid fa-user-gear text-lg"></i>
                                    </button>
                                    <div id="role-menu-mobile-${user.id}" class="role-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                                        <div class="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Change Role
                                        </div>
                                        <button onclick="updateUserRole('${user.id}', 'admin')" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2">
                                            <i class="fa-solid fa-shield-halved text-xs w-4"></i> Admin
                                        </button>
                                        <button onclick="updateUserRole('${user.id}', 'user')" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2">
                                            <i class="fa-solid fa-user text-xs w-4"></i> User
                                        </button>
                                    </div>
                                </div>
                                <button onclick="deleteUser('${user.id}')" class="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50" title="Delete User">
                                    <i class="fa-solid fa-trash-can text-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                mobileCards.appendChild(card);
            }
        });
    } catch (error) {
        console.error('Error loading users:', error);
        const tableBody = document.getElementById('users-table-body');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Failed to load users</td></tr>';
        }
        const mobileCards = document.getElementById('users-cards-mobile');
        if (mobileCards) {
            mobileCards.innerHTML = '<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-red-500">Failed to load users</div>';
        }
    }
}

// Toggle role menu (desktop)
function toggleRoleMenu(event, userId) {
    event.stopPropagation();
    const menu = document.getElementById(`role-menu-${userId}`);

    // Close all other menus
    document.querySelectorAll('.role-menu').forEach(m => {
        if (m.id !== `role-menu-${userId}`) {
            m.classList.add('hidden');
        }
    });

    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Toggle role menu (mobile)
function toggleRoleMenuMobile(event, userId) {
    event.stopPropagation();
    const menu = document.getElementById(`role-menu-mobile-${userId}`);

    // Close all other menus
    document.querySelectorAll('.role-menu').forEach(m => {
        if (m.id !== `role-menu-mobile-${userId}`) {
            m.classList.add('hidden');
        }
    });

    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Close menus when clicking outside
window.addEventListener('click', () => {
    document.querySelectorAll('.role-menu').forEach(menu => {
        menu.classList.add('hidden');
    });
});

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        // Reload users and stats
        await loadUsers();
        await loadAdminStats();
        alert('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
}

// Update user role
async function updateUserRole(userId, newRole) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole })
        });

        if (!response.ok) {
            throw new Error('Failed to update user role');
        }

        // Reload users and stats
        await loadUsers();
        await loadAdminStats();
        alert(`User role updated to ${newRole}`);
    } catch (error) {
        console.error('Error updating user role:', error);
        alert('Failed to update user role');
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

        // Destroy existing chart if it exists
        if (window.genreChartInstance) {
            window.genreChartInstance.destroy();
        }

        window.genreChartInstance = new Chart(genreCtx, {
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

// Load user growth statistics and update chart
async function loadUserGrowthStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/user-growth`);
        if (!response.ok) {
            throw new Error('Failed to fetch user growth stats');
        }
        const userGrowth = await response.json();
        console.log('User growth stats loaded:', userGrowth);

        const chartColors = {
            primary: '#1f2937',
            background: 'rgba(31, 41, 55, 0.1)',
            gridColor: '#e5e7eb',
            textColor: '#6b7280'
        };

        // Extract labels and data
        const labels = userGrowth.map(item => item.label);
        const data = userGrowth.map(item => item.count);

        // Initialize Users Growth Chart
        const usersGrowthCtx = document.getElementById('usersGrowthChart').getContext('2d');

        // Destroy existing chart if it exists
        if (window.usersGrowthChartInstance) {
            window.usersGrowthChartInstance.destroy();
        }

        window.usersGrowthChartInstance = new Chart(usersGrowthCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'New Users',
                    data: data,
                    borderColor: chartColors.primary,
                    backgroundColor: chartColors.background,
                    tension: 0.4,
                    fill: true
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
                            color: chartColors.textColor,
                            stepSize: 1
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
        console.error('Error loading user growth stats:', error);
    }
}

// Load user activity statistics
async function loadUserActivity() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/user-activity`);
        if (!response.ok) {
            throw new Error('Failed to fetch user activity stats');
        }
        const activityData = await response.json();
        console.log('User activity stats loaded:', activityData);

        // Update activity stats cards
        document.getElementById('active-24h').textContent = activityData.activeIn24Hours.toLocaleString();
        document.getElementById('active-7d').textContent = activityData.activeIn7Days.toLocaleString();
        document.getElementById('active-30d').textContent = activityData.activeIn30Days.toLocaleString();

        // Create daily activity chart
        const chartColors = {
            primary: '#10b981',
            background: 'rgba(16, 185, 129, 0.1)',
            gridColor: '#e5e7eb',
            textColor: '#6b7280'
        };

        // Prepare data for last 7 days (fill in missing days with 0)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = activityData.dailyActivity.find(d => d.date === dateStr);
            last7Days.push({
                label: date.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' }),
                count: dayData ? dayData.count : 0
            });
        }

        const labels = last7Days.map(d => d.label);
        const data = last7Days.map(d => d.count);

        // Initialize Daily Activity Chart
        const dailyActivityCtx = document.getElementById('dailyActivityChart').getContext('2d');

        // Destroy existing chart if it exists
        if (window.dailyActivityChartInstance) {
            window.dailyActivityChartInstance.destroy();
        }

        window.dailyActivityChartInstance = new Chart(dailyActivityCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Active Users',
                    data: data,
                    backgroundColor: chartColors.primary,
                    borderColor: chartColors.primary,
                    borderWidth: 0,
                    borderRadius: 6
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
                            color: chartColors.textColor,
                            stepSize: 1
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
        console.error('Error loading user activity stats:', error);
        // Set to 0 on error
        document.getElementById('active-24h').textContent = '0';
        document.getElementById('active-7d').textContent = '0';
        document.getElementById('active-30d').textContent = '0';
    }
}

// Helper function to format relative time
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
}

// Helper function to get activity color based on recency
function getActivityColor(date) {
    if (!date) return 'bg-gray-100 text-gray-800';

    const now = new Date();
    const diffHours = (now - date) / 3600000;

    if (diffHours < 24) return 'bg-green-100 text-green-800';
    if (diffHours < 168) return 'bg-blue-100 text-blue-800';
    if (diffHours < 720) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
}
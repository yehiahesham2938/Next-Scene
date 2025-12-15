import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../services/api';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chart refs
  const usersGrowthChartRef = useRef(null);
  const genreChartRef = useRef(null);
  const dailyActivityChartRef = useRef(null);
  
  // Chart instances
  const usersGrowthChartInstance = useRef(null);
  const genreChartInstance = useRef(null);
  const dailyActivityChartInstance = useRef(null);

  useEffect(() => {
    // Force light theme for admin
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    
    fetchAdminData();
    
    return () => {
      // Cleanup charts
      if (usersGrowthChartInstance.current) usersGrowthChartInstance.current.destroy();
      if (genreChartInstance.current) genreChartInstance.current.destroy();
      if (dailyActivityChartInstance.current) dailyActivityChartInstance.current.destroy();
    };
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const moviesData = await movieAPI.getAll();
      setMovies(moviesData);
      
      // Get users from localStorage (mock data for now)
      const storedUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      setUsers(storedUsers);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    totalUsers: users.length || 15,
    totalMovies: movies.length,
    totalWatchlists: calculateTotalWatchlists(),
    adminUsers: users.filter(u => u.role === 'admin').length || 2,
    active24h: Math.floor(users.length * 0.6) || 9,
    active7d: Math.floor(users.length * 0.8) || 12,
    active30d: Math.floor(users.length * 0.95) || 14,
  };

  function calculateTotalWatchlists() {
    let count = 0;
    users.forEach(user => {
      const userWatchlist = JSON.parse(localStorage.getItem(`watchlist_${user.username}`) || '[]');
      count += userWatchlist.length;
    });
    return count || 42; // Default value if no data
  }

  // Get most added to watchlists
  const getMostWatchlisted = () => {
    const movieCounts = {};
    
    users.forEach(user => {
      const watchlist = JSON.parse(localStorage.getItem(`watchlist_${user.username}`) || '[]');
      watchlist.forEach(item => {
        const movieId = item.id || item.title;
        movieCounts[movieId] = (movieCounts[movieId] || 0) + 1;
      });
    });

    const sortedMovies = Object.entries(movieCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([id, count]) => {
        const movie = movies.find(m => m._id === id || m.title === id);
        return movie ? { ...movie, watchlistCount: count } : null;
      })
      .filter(Boolean);

    // If no data, return sample movies
    if (sortedMovies.length === 0 && movies.length > 0) {
      return movies.slice(0, 4).map((m, i) => ({
        ...m,
        watchlistCount: [234, 189, 167, 145][i] || 100
      }));
    }

    return sortedMovies;
  };

  // Initialize charts after data is loaded
  useEffect(() => {
    if (!loading && movies.length > 0) {
      initializeCharts();
    }
  }, [loading, movies]);

  const initializeCharts = () => {
    try {
      // Users Growth Chart (Pie)
      if (usersGrowthChartRef.current) {
        if (usersGrowthChartInstance.current) {
          usersGrowthChartInstance.current.destroy();
        }
        
        const ctx = usersGrowthChartRef.current.getContext('2d');
        usersGrowthChartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['New Users (Last 30 Days)', 'Active Users', 'Inactive Users'],
          datasets: [{
            data: [
              Math.floor(stats.totalUsers * 0.2),
              Math.floor(stats.totalUsers * 0.6),
              Math.floor(stats.totalUsers * 0.2)
            ],
            backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#374151', font: { size: 12 } }
            }
          }
        }
      });
    }

    // Movies per Genre Chart (Bar)
    if (genreChartRef.current) {
      if (genreChartInstance.current) {
        genreChartInstance.current.destroy();
      }
      
      const genreCounts = {};
      movies.forEach(movie => {
        const genres = (movie.genre || '').split(',').map(g => g.trim());
        genres.forEach(genre => {
          if (genre) {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          }
        });
      });

      const sortedGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8);

      const ctx = genreChartRef.current.getContext('2d');
      genreChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sortedGenres.map(([genre]) => genre),
          datasets: [{
            label: 'Number of Movies',
            data: sortedGenres.map(([, count]) => count),
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#6b7280', stepSize: 1 },
              grid: { color: '#e5e7eb' }
            },
            x: {
              ticks: { color: '#6b7280' },
              grid: { display: false }
            }
          }
        }
      });
    }

    // Daily Activity Chart (Line)
    if (dailyActivityChartRef.current) {
      if (dailyActivityChartInstance.current) {
        dailyActivityChartInstance.current.destroy();
      }
      
      const last7Days = ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'];
      const activityData = [
        Math.floor(stats.totalUsers * 0.5),
        Math.floor(stats.totalUsers * 0.6),
        Math.floor(stats.totalUsers * 0.55),
        Math.floor(stats.totalUsers * 0.7),
        Math.floor(stats.totalUsers * 0.65),
        Math.floor(stats.totalUsers * 0.75),
        Math.floor(stats.totalUsers * 0.8)
      ];

      const ctx = dailyActivityChartRef.current.getContext('2d');
      dailyActivityChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: last7Days,
          datasets: [{
            label: 'Active Users',
            data: activityData,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#6b7280', stepSize: 2 },
              grid: { color: '#e5e7eb' }
            },
            x: {
              ticks: { color: '#6b7280' },
              grid: { display: false }
            }
          }
        }
      });
    }
    } catch (error) {
      console.error('Error initializing charts:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading dashboard</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAdminData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const mostWatchlisted = getMostWatchlisted();

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* ADMIN STATS SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Admin Statistics</h2>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {/* Total Users Card */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>

            {/* Total Movies Card */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-gray-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Movies</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalMovies}</p>
            </div>

            {/* Total Watchlists Card */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-purple-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Watchlists</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalWatchlists}</p>
            </div>

            {/* Admin Users Card */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-green-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Admin Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHARTS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Users Growth Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Users Growth</h3>
              <div className="flex justify-center mb-4">
                <canvas ref={usersGrowthChartRef} width="400" height="300"></canvas>
              </div>
            </div>

            {/* Movies per Genre Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Movies per Genre</h3>
              <div className="flex justify-center mb-4">
                <canvas ref={genreChartRef} width="400" height="300"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOST ADDED TO WATCHLISTS SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Most Added to Watchlists</h2>

          {/* Movie Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mostWatchlisted.map((movie, index) => (
              <div
                key={movie._id || index}
                onClick={() => navigate(`/movie/${movie._id}`)}
                className="bg-white rounded overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
              >
                <div className="w-full h-48 bg-gray-400 flex items-center justify-center text-white">
                  <img
                    src={movie.poster || '/img/image1tst.png'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{movie.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{movie.releaseYear}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-500">
                      ⭐ <span className="text-gray-700 text-sm">{movie.rating || 'N/A'}</span>
                    </div>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      Added {movie.watchlistCount} times
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USER ACTIVITY SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">User Activity</h2>

          {/* Activity Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Active in Last 24 Hours */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-green-100 rounded-full p-3">
                  <i className="fas fa-clock text-green-600 text-xl"></i>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Active in Last 24 Hours</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active24h}</p>
            </div>

            {/* Active in Last 7 Days */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-100 rounded-full p-3">
                  <i className="fas fa-calendar-week text-blue-600 text-xl"></i>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Active in Last 7 Days</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active7d}</p>
            </div>

            {/* Active in Last 30 Days */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-purple-100 rounded-full p-3">
                  <i className="fas fa-calendar-alt text-purple-600 text-xl"></i>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Active in Last 30 Days</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active30d}</p>
            </div>
          </div>

          {/* Daily Activity Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Daily User Activity (Last 7 Days)</h3>
            <div className="flex justify-center">
              <canvas ref={dailyActivityChartRef} width="400" height="200"></canvas>
            </div>
          </div>
        </div>
      </section>

      {/* USER MANAGEMENT SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">User Management</h2>
          </div>

          {/* Users Table (Desktop) */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Watchlist Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => {
                    const userWatchlist = JSON.parse(localStorage.getItem(`watchlist_${user.username}`) || '[]');
                    return (
                      <tr key={user._id || user.username}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <i className="fa-solid fa-user text-gray-600"></i>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role || 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userWatchlist.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Users Cards (Mobile) */}
          <div className="md:hidden space-y-4">
            {users.length > 0 ? (
              users.map((user) => {
                const userWatchlist = JSON.parse(localStorage.getItem(`watchlist_${user.username}`) || '[]');
                return (
                  <div key={user._id || user.username} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        <i className="fa-solid fa-user text-gray-600"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role || 'User'}
                      </span>
                      <span className="text-xs text-gray-600">
                        Watchlist: {userWatchlist.length}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-sm text-gray-500">No users found</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

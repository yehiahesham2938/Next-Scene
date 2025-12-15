import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { movieAPI } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [allMovies, setAllMovies] = useState([]);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { watchlist = [], watchedMovies = [] } = useWatchlist() || {};
  const { theme } = useTheme();
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (!isLoading && allMovies.length > 0 && pieChartRef.current && barChartRef.current) {
      try {
        updateCharts();
      } catch (err) {
        console.error('Error updating charts:', err);
      }
    }
    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
    };
  }, [isLoading, allMovies, watchlist, watchedMovies, theme]);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allData = await movieAPI.getAll();
      setAllMovies(allData || []);
      setSuggestedMovies((allData || []).slice(0, 10));
    } catch (err) {
      console.error('Error loading movies:', err);
      setError(err.message);
      setAllMovies([]);
      setSuggestedMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalMovies = allMovies.length;
    const watchlistCount = watchlist.length + watchedMovies.length;
    const watchedCount = watchedMovies.length;

    // Calculate genre distribution from watchlist
    const genreCounts = {};
    const allWatchlistItems = [...watchlist, ...watchedMovies];
    
    allWatchlistItems.forEach((watchlistMovie) => {
      const movie = allMovies.find(m => m._id === watchlistMovie.id || m.title === watchlistMovie.title);
      if (movie && movie.genre) {
        const genres = movie.genre.split(',').map(g => g.trim());
        genres.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    return {
      totalMovies,
      watchlistCount,
      watchedCount,
      genreCounts,
    };
  }, [allMovies, watchlist, watchedMovies]);

  const updateCharts = () => {
    const isDarkMode = theme === 'dark';
    const chartColors = {
      primary: isDarkMode ? '#60a5fa' : '#1f2937',
      secondary: isDarkMode ? '#374151' : '#d1d5db',
      gridColor: isDarkMode ? '#374151' : '#e5e7eb',
      textColor: isDarkMode ? '#d1d5db' : '#6b7280',
    };

    // Pie Chart
    if (pieChartRef.current) {
      const watchedCount = stats.watchedCount;
      const unwatchedCount = stats.watchlistCount - stats.watchedCount;

      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }

      const ctx = pieChartRef.current.getContext('2d');
      pieChartInstance.current = new ChartJS(ctx, {
        type: 'pie',
        data: {
          labels: ['Watched', 'Unwatched'],
          datasets: [{
            data: [watchedCount, unwatchedCount],
            backgroundColor: [chartColors.primary, chartColors.secondary],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: chartColors.textColor,
                padding: 15,
                font: { size: 12 },
              },
            },
          },
        },
      });
    }

    // Bar Chart
    if (barChartRef.current) {
      const topGenres = Object.entries(stats.genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      const ctx = barChartRef.current.getContext('2d');
      barChartInstance.current = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: topGenres.map(([genre]) => genre),
          datasets: [{
            label: 'Movies',
            data: topGenres.map(([, count]) => count),
            backgroundColor: chartColors.primary,
            borderRadius: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: { color: chartColors.textColor },
              grid: { color: chartColors.gridColor },
            },
            y: {
              ticks: { color: chartColors.textColor },
              grid: { color: chartColors.gridColor },
            },
          },
        },
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16 sm:mt-0">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  }

  const watchedPercentage = stats.watchlistCount > 0 
    ? Math.round((stats.watchedCount / stats.watchlistCount) * 100) 
    : 0;
  const unwatchedPercentage = 100 - watchedPercentage;

  const topGenres = Object.entries(stats.genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const genreSummary = topGenres.map(([genre, count]) => `${genre}: ${count}`).join(' | ') || 'No genre data';

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 mt-16 sm:mt-0">
      {/* Stats Section */}
      <div className="mb-8">
        {/* Mobile Title */}
        <h2 className="sm:hidden text-xl font-bold mb-4 dark:text-white">Your Stats</h2>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Total Movies Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 order-1 stat-card transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Total Movies</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMovies}</p>
          </div>

          {/* Watchlist Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 order-2 stat-card transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Watchlist</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.watchlistCount}</p>
          </div>

          {/* Watched Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 order-3 stat-card transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Watched</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.watchedCount}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Watched vs Unwatched Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-all hover:shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">Watched vs Unwatched</h3>
          <div className="flex justify-center mb-4">
            <canvas ref={pieChartRef} className="max-w-full"></canvas>
          </div>
          <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {watchedPercentage}% Watched | {unwatchedPercentage}% Unwatched
          </p>
        </div>

        {/* Movies per Genre Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-all hover:shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">Movies per Genre</h3>
          <div className="flex justify-center mb-4">
            <canvas ref={barChartRef} className="max-w-full"></canvas>
          </div>
          <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">{genreSummary}</p>
        </div>
      </div>

      {/* Suggested Movies Section */}
      <div className="mb-8">
        {/* Desktop Title */}
        <div className="hidden sm:flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold lowercase dark:text-white">suggested movies:</h2>
        </div>

        {/* Mobile Title */}
        <div className="sm:hidden flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Recently Added</h2>
          <Link to="/browse" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            View All
          </Link>
        </div>

        {/* Horizontal Scroll Movie Cards */}
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
          {suggestedMovies.map((movie) => (
            <Link
              key={movie._id}
              to={`/movie/${movie._id}`}
              className="flex-shrink-0 w-32 bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition block"
            >
              <div className="w-full h-40 bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white transition-colors overflow-hidden">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white transition-colors line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 transition-colors">{movie.releaseYear}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  ⭐ <span className="text-gray-700 dark:text-gray-300 text-xs transition-colors">{movie.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

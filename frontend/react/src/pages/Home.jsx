import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { movieAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLatestMovies();
  }, []);

  const fetchLatestMovies = async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getAll(8);
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleExplore = () => {
    navigate('/browse');
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-center bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
            Discover Your Next Favorite Movie
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 transition-colors">
            Explore thousands of movies, create your watchlist, and never miss a great film again.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center gap-2 mb-8 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded w-full focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
            />
            <button
              type="submit"
              className="bg-black dark:bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800 dark:hover:bg-gray-600 transition-all btn-hover flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="ml-2 sm:hidden">Search</span>
            </button>
          </form>

          {/* CTA Button */}
          <button
            onClick={handleExplore}
            className="bg-black dark:bg-gray-700 text-white px-8 py-3 rounded hover:bg-gray-800 dark:hover:bg-gray-600 font-medium transition-all btn-hover"
          >
            Explore Movies
          </button>
        </div>
      </section>

      {/* Latest Movies Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white transition-colors">
            Latest Movies
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={{ ...movie, id: movie._id }} onClick={handleMovieClick} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-12 text-gray-900 dark:text-white transition-colors">
            Why Choose Next-Scene?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center feature-card p-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black dark:bg-gray-700 text-white rounded-full flex items-center justify-center mb-4 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-white transition-colors">
                Smart Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Find movies by title, genre, actor, or director with our intelligent search system.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center feature-card p-4">
              <div className="w-16 h-16 bg-black dark:bg-gray-700 text-white rounded-full flex items-center justify-center mb-4 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white transition-colors">
                Personal Watchlist
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Save movies to watch later and track your viewing progress.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center feature-card p-4">
              <div className="w-16 h-16 bg-black dark:bg-gray-700 text-white rounded-full flex items-center justify-center mb-4 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white transition-colors">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Get insights into your viewing habits and discover new genres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Hidden for logged in users */}
      {!user && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800 text-center transition-colors">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              Ready to Start Your Movie Journey?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors">
              Join thousands of movie enthusiasts and discover your next favorite film.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-black dark:bg-gray-700 text-white px-8 py-3 rounded hover:bg-gray-800 dark:hover:bg-gray-600 font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

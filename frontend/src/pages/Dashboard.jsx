import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  SectionHeader,
  MovieCard,
  InputField,
  PrimaryButton,
} from '../components';
import StatsCard from '../components/StatsCard';
import WatchedChart from '../components/WatchedChart';
import GenreChart from '../components/GenreChart';
import { useWatchlist } from '../context/WatchlistContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { watchlist, watchedMovies } = useWatchlist();

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all movies for charts
        const allResponse = await fetch(`${API_BASE_URL}/api/movies`);
        if (!allResponse.ok) {
          throw new Error('Failed to fetch movies');
        }
        const allData = await allResponse.json();

        // Fetch recent movies (8 for display)
        const recentResponse = await fetch(`${API_BASE_URL}/api/movies?limit=8`);
        if (!recentResponse.ok) {
          throw new Error('Failed to fetch recent movies');
        }
        const recentData = await recentResponse.json();

        const mapMovie = (movie) => ({
          id: movie._id,
          title: movie.title,
          year: movie.releaseYear ? parseInt(movie.releaseYear, 10) : null,
          rating: movie.rating,
          poster: movie.poster,
          genre: movie.genre,
        });

        setAllMovies(allData.map(mapMovie));
        setRecentMovies(recentData.map(mapMovie));
      } catch (err) {
        setError(err.message || 'Something went wrong while loading movies.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalMovies = allMovies.length;
    const watchlistCount = watchlist.length;
    
    // Count how many movies from the database are marked as watched
    const watchedMovieIds = new Set(watchedMovies.map(m => m.id));
    const watchedCount = allMovies.filter(movie => watchedMovieIds.has(movie.id)).length;
    const unwatchedCount = totalMovies - watchedCount;

    // Calculate average rating from watched movies in the database
    const watchedMoviesFromDb = allMovies.filter(movie => watchedMovieIds.has(movie.id));
    const avgRating = watchedMoviesFromDb.length > 0
      ? (watchedMoviesFromDb.reduce((sum, movie) => sum + (movie.rating || 0), 0) / watchedMoviesFromDb.length).toFixed(1)
      : '0.0';

    // Calculate genre distribution from ALL movies in database
    const genreCounts = {};
    allMovies.forEach((movie) => {
      if (movie.genre) {
        const genres = movie.genre.split(',').map(g => g.trim());
        genres.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    const genreData = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 genres

    // Calculate watched vs unwatched for pie chart
    const watchedPercentage = totalMovies > 0 
      ? Math.round((watchedCount / totalMovies) * 100) 
      : 0;
    const unwatchedPercentage = totalMovies > 0 
      ? Math.round((unwatchedCount / totalMovies) * 100) 
      : 0;

    return {
      totalMovies,
      watchlistCount,
      watchedCount,
      unwatchedCount,
      avgRating,
      genreData,
      watchedPercentage,
      unwatchedPercentage,
    };
  }, [allMovies, watchlist, watchedMovies]);

  return (
    <PageContainer className="pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Your Next Favorite Movie
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Explore thousands of movies, create your watchlist, and never miss a great film again.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <InputField
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              className="flex-1"
            />
            <PrimaryButton type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </PrimaryButton>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <StatsCard
              title="Total Movies"
              value={stats.totalMovies}
              color="blue"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              }
            />
            <StatsCard
              title="Watchlist"
              value={stats.watchlistCount}
              color="purple"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              }
            />
            <StatsCard
              title="Watched"
              value={stats.watchedCount}
              color="green"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Avg Rating"
              value={stats.avgRating}
              color="yellow"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <WatchedChart
              watchedCount={stats.watchedCount}
              unwatchedCount={stats.unwatchedCount}
            />
            <GenreChart genreData={stats.genreData} />
          </div>

          {/* Recently Added Movies Section */}
          <div className="mb-12">
            <SectionHeader
              title="Recently Added"
              subtitle="Latest additions to the catalog"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  poster={movie.poster}
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default Dashboard;

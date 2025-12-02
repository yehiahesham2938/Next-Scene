import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  SectionHeader,
  MovieCard,
  InputField,
  PrimaryButton,
} from '../components';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [latestMovies, setLatestMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    async function fetchLatestMovies() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/movies?limit=4`);
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();

        const mapped = data.map((movie) => ({
          id: movie._id,
          title: movie.title,
          year: movie.releaseYear ? parseInt(movie.releaseYear, 10) : null,
          rating: movie.rating,
          poster: movie.poster,
        }));

        setLatestMovies(mapped);
      } catch (err) {
        setError(err.message || 'Something went wrong while loading movies.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestMovies();
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

      {/* Latest Movies Section */}
      <div className="mb-12">
        <SectionHeader
          title="Latest Movies"
          subtitle="Newest additions to the catalog"
        />

        {isLoading && (
          <p className="text-gray-600 dark:text-gray-400">Loading movies...</p>
        )}

        {error && !isLoading && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestMovies.map((movie) => (
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
        )}
      </div>
    </PageContainer>
  );
};

export default Dashboard;

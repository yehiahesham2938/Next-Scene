import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  SectionHeader,
  MovieCard,
  InputField,
  PrimaryButton,
} from '../components';
import { getTrendingMovies, getPopularMovies } from '../utils/movieData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const trendingMovies = getTrendingMovies(4);
  const popularMovies = getPopularMovies(4);

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

      {/* Trending Section */}
      <div className="mb-12">
        <SectionHeader
          title="Trending Now"
          subtitle="Popular movies this week"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              onClick={() => handleMovieClick(movie.id)}
            />
          ))}
        </div>
      </div>

      {/* Popular Section */}
      <div className="mb-12">
        <SectionHeader
          title="Popular Movies"
          subtitle="All-time favorites"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              onClick={() => handleMovieClick(movie.id)}
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;

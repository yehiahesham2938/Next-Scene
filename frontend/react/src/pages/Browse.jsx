import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { movieAPI } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Browse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { watchlist, watchedMovies, addToWatchlist, removeFromWatchlist } = useWatchlist();
  
  const [allMovies, setAllMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genre: '',
    year: '',
    rating: '',
    sort: 'popularity'
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const data = await movieAPI.getAll();
      setAllMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setAllMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let result = [...allMovies];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(movie => 
        movie.title?.toLowerCase().includes(searchLower) ||
        movie.description?.toLowerCase().includes(searchLower) ||
        movie.genre?.toLowerCase().includes(searchLower)
      );
    }

    // Genre filter
    if (filters.genre) {
      result = result.filter(movie => 
        movie.genre?.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    // Year filter
    if (filters.year) {
      result = result.filter(movie => {
        const movieYear = movie.year || movie.releaseDate?.split('-')[0];
        return movieYear === filters.year;
      });
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      result = result.filter(movie => (movie.rating || 0) >= minRating);
    }

    // Sort
    switch (filters.sort) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'rating-asc':
        result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case 'year':
        result.sort((a, b) => {
          const yearA = a.year || a.releaseDate?.split('-')[0] || 0;
          const yearB = b.year || b.releaseDate?.split('-')[0] || 0;
          return yearB - yearA;
        });
        break;
      case 'year-asc':
        result.sort((a, b) => {
          const yearA = a.year || a.releaseDate?.split('-')[0] || 0;
          const yearB = b.year || b.releaseDate?.split('-')[0] || 0;
          return yearA - yearB;
        });
        break;
      case 'title':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'popularity':
      default:
        // Keep original order (assumed to be by popularity)
        break;
    }

    return result;
  }, [allMovies, filters]);

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genre: '',
      year: '',
      rating: '',
      sort: 'popularity'
    });
    setSearchParams({});
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleToggleWatchlist = async (e, movie) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isInWatchlist = [...watchlist, ...watchedMovies].some(
      m => m.id === movie._id || m.title === movie.title
    );

    if (isInWatchlist) {
      await removeFromWatchlist(movie._id);
    } else {
      await addToWatchlist(movie._id);
    }
  };

  const handleDeleteMovie = async (e, movieId, movieTitle) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${movieTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await movieAPI.delete(movieId);
      setAllMovies(prev => prev.filter(m => m._id !== movieId));
      alert('Movie deleted successfully');
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie: ' + error.message);
    }
  };

  const isInWatchlist = (movieId, movieTitle) => {
    return [...watchlist, ...watchedMovies].some(
      m => m.id === movieId || m.title === movieTitle
    );
  };

  // Get unique genres for filter
  const allGenres = useMemo(() => {
    const genresSet = new Set();
    allMovies.forEach(movie => {
      if (movie.genre) {
        movie.genre.split(',').forEach(g => genresSet.add(g.trim()));
      }
    });
    return Array.from(genresSet).sort();
  }, [allMovies]);

  // Get unique years for filter
  const allYears = useMemo(() => {
    const yearsSet = new Set();
    allMovies.forEach(movie => {
      const year = movie.year || movie.releaseDate?.split('-')[0];
      if (year) yearsSet.add(year);
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [allMovies]);

  const MovieCardComponent = ({ movie, isMobile = false }) => {
    const inWatchlist = isInWatchlist(movie._id, movie.title);
    // const year = movie.year || movie.releaseDate?.split('-')[0] || 'N/A';
    const year = movie.year || movie.releaseYear || movie.releaseDate?.split('-')[0] || 'N/A';
    const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
    const genres = movie.genre || 'Unknown';
    const runtime = movie.runtime || 'N/A';

    if (isMobile) {
      return (
        <div
          onClick={() => handleMovieClick(movie._id)}
          className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow movie-card cursor-pointer"
        >
          <div className="w-full aspect-[2/3] bg-gray-300 dark:bg-gray-700 overflow-hidden">
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xs">
                No Image
              </div>
            )}
          </div>

          <button
            onClick={(e) => isAdmin ? handleDeleteMovie(e, movie._id, movie.title) : handleToggleWatchlist(e, movie)}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center z-10 ${
              isAdmin ? 'bg-red-600' : 'bg-gray-800'
            }`}
          >
            <i className={`${isAdmin ? 'fas fa-trash' : inWatchlist ? 'fas fa-bookmark' : 'far fa-bookmark'} text-white text-xs`}></i>
          </button>

          <div className="p-2">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1 mb-1">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">{year}</span>
              <div className="flex items-center gap-1">
                <i className="fas fa-star text-yellow-500 text-xs"></i>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{rating}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Desktop card
    return (
      <div
        onClick={() => handleMovieClick(movie._id)}
        className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-200 cursor-pointer group movie-card"
      >
        <div className="w-full aspect-[2/3] bg-gray-300 dark:bg-gray-700 overflow-hidden">
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xs">
              No Image
            </div>
          )}
        </div>

        <button
          onClick={(e) => isAdmin ? handleDeleteMovie(e, movie._id, movie.title) : handleToggleWatchlist(e, movie)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity ${
            isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-900'
          }`}
        >
          <i className={`${isAdmin ? 'fas fa-trash' : inWatchlist ? 'fas fa-bookmark' : 'far fa-bookmark'} text-white text-sm`}></i>
        </button>

        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1 mb-1">
            {movie.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
            {year} • {genres.split(',')[0]}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <i className="fas fa-star text-yellow-500 text-xs"></i>
              <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">{rating}</span>
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-xs">{runtime}</span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 mt-16 sm:mt-0">
      {/* Desktop Header */}
      <div className="hidden md:block mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Browse Movies</h1>
        <p className="text-gray-600 dark:text-gray-300">Discover and explore thousands of movies</p>
      </div>

      {/* Mobile Header with Search */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Browse</h1>
        <div className="relative mb-4">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search movies..."
            className="w-full px-4 py-3 pr-10 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Mobile Genre Pills */}
      <div className="md:hidden mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max">
          <button
            onClick={() => handleFilterChange('genre', '')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium active:scale-95 transition-transform ${
              !filters.genre
                ? 'bg-black dark:bg-white dark:text-black text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi'].map(genre => (
            <button
              key={genre}
              onClick={() => handleFilterChange('genre', genre)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap active:scale-95 transition-all ${
                filters.genre === genre
                  ? 'bg-black dark:bg-white dark:text-black text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Search and Filters */}
      <div className="hidden md:block mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search movies, actors, directors..."
              className="w-full px-4 py-2.5 pr-10 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <option value="">All Genres</option>
              {allGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <option value="">All Years</option>
              {allYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <option value="">All Ratings</option>
              <option value="9">9+ ⭐</option>
              <option value="8">8+ ⭐</option>
              <option value="7">7+ ⭐</option>
              <option value="6">6+ ⭐</option>
              <option value="5">5+ ⭐</option>
            </select>

            {(filters.genre || filters.year || filters.rating) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm transition-colors flex items-center gap-2"
              >
                <i className="fas fa-times"></i>
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Showing {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
            </span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="rating">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="year">Year: Newest First</option>
              <option value="year-asc">Year: Oldest First</option>
              <option value="title">Title: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-4">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCardComponent key={movie._id} movie={movie} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No movies found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCardComponent key={movie._id} movie={movie} isMobile={true} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No movies found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;

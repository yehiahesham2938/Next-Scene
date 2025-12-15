import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { movieAPI, adminAPI } from '../services/api';

const AdminBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  // Mobile genre pills
  const mobilePills = ['All', 'Action', 'Drama', '2024', '5+ ⭐'];

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieAPI.getAll();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let filtered = [...movies];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(movie => {
        const title = (movie.title || '').toLowerCase();
        const genre = (movie.genre || '').toLowerCase();
        const description = (movie.description || '').toLowerCase();
        const director = (movie.director || '').toLowerCase();
        const cast = (movie.cast || []).join(' ').toLowerCase();

        return title.includes(query) ||
               genre.includes(query) ||
               description.includes(query) ||
               director.includes(query) ||
               cast.includes(query);
      });
    }

    // Genre filter
    if (selectedGenre) {
      filtered = filtered.filter(movie => {
        const genres = (movie.genre || '').toLowerCase();
        return genres.includes(selectedGenre.toLowerCase());
      });
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter(movie => 
        movie.releaseYear?.toString() === selectedYear
      );
    }

    // Rating filter
    if (selectedRating) {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(movie => 
        (movie.rating || 0) >= minRating
      );
    }

    // Sort movies
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'rating-asc':
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case 'year':
        filtered.sort((a, b) => {
          const yearA = parseInt(a.releaseYear) || 0;
          const yearB = parseInt(b.releaseYear) || 0;
          return yearB - yearA;
        });
        break;
      case 'year-asc':
        filtered.sort((a, b) => {
          const yearA = parseInt(a.releaseYear) || 0;
          const yearB = parseInt(b.releaseYear) || 0;
          return yearA - yearB;
        });
        break;
      case 'title':
        filtered.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return titleA.localeCompare(titleB);
        });
        break;
      case 'popularity':
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [movies, searchQuery, selectedGenre, selectedYear, selectedRating, sortBy]);

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setSortBy('popularity');
    setSearchParams({});
  };

  // Handle movie deletion
  const handleDeleteMovie = async (movieId, movieTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${movieTitle}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteMovie(movieId);
      setMovies(movies.filter(m => m._id !== movieId));
      alert('Movie deleted successfully');
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie');
    }
  };

  // Navigate to movie details
  const viewMovieDetails = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Desktop Header */}
      <div className="hidden md:block mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Browse Movies</h1>
        <p className="text-gray-600 dark:text-gray-300">Discover and explore thousands of movies</p>
      </div>

      {/* Mobile Header and Search */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Browse</h1>
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
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
          {mobilePills.map((pill, index) => {
            const isActive = pill === 'All' && !selectedGenre && !selectedYear && !selectedRating;
            const isGenre = pill === 'Action' || pill === 'Drama';
            const isYear = pill === '2024';
            const isRating = pill === '5+ ⭐';

            const handleClick = () => {
              if (pill === 'All') {
                clearFilters();
              } else if (isGenre) {
                setSelectedGenre(pill);
                setSelectedYear('');
                setSelectedRating('');
              } else if (isYear) {
                setSelectedYear('2024');
                setSelectedGenre('');
                setSelectedRating('');
              } else if (isRating) {
                setSelectedRating('5');
                setSelectedGenre('');
                setSelectedYear('');
              }
            };

            return (
              <button
                key={index}
                onClick={handleClick}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-black dark:bg-white dark:text-black text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block mb-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search movies, actors, directors..."
              className="w-full px-9 py-3 pr-10 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            />
            <button className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <option value="">All Genres</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Animation">Animation</option>
              <option value="Comedy">Comedy</option>
              <option value="Crime">Crime</option>
              <option value="Drama">Drama</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <option value="">All Years</option>
              {Array.from({ length: 17 }, (_, i) => 2024 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <option value="">All Ratings</option>
              <option value="9">9+ Stars</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
              <option value="5">5+ Stars</option>
            </select>
            
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm hover:text-black dark:hover:text-white flex items-center gap-2"
            >
              <i className="fas fa-times"></i> Clear Filters
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Showing {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded text-sm focus:outline-none"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating (High to Low)</option>
              <option value="rating-asc">Rating (Low to High)</option>
              <option value="year">Year (Newest)</option>
              <option value="year-asc">Year (Oldest)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {searchQuery ? `No movies found for "${searchQuery}"` : 'No movies match your filters'}
          </p>
        </div>
      )}

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-4">
        {filteredMovies.map((movie) => (
          <div
            key={movie._id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer"
          >
            <div className="relative" onClick={() => viewMovieDetails(movie._id)}>
              <div className="w-full aspect-[2/3] bg-gray-300 flex items-center justify-center text-white text-sm">
                <img
                  src={movie.poster || '/img/image1tst.png'}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMovie(movie._id, movie.title);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-700 z-10"
                title="Delete Movie"
              >
                <i className="fas fa-trash text-white text-sm"></i>
              </button>
            </div>
            <div className="p-3" onClick={() => viewMovieDetails(movie._id)}>
              <h3 className="font-semibold text-sm mb-1 truncate text-gray-900 dark:text-white">
                {movie.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                {movie.releaseYear}
              </p>
              <div className="flex items-center gap-1">
                <i className="fas fa-star text-yellow-500 text-xs"></i>
                <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">
                  {movie.rating || 'N/A'}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                {movie.genre}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile List */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        {filteredMovies.map((movie) => (
          <div
            key={movie._id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 flex gap-3 shadow-sm"
            onClick={() => viewMovieDetails(movie._id)}
          >
            <div className="w-16 h-24 bg-gray-300 rounded flex-shrink-0 flex items-center justify-center text-white text-xs">
              <img
                src={movie.poster || '/img/image1tst.png'}
                alt={movie.title}
                className="inset-0 w-16 h-24 object-cover rounded flex-shrink-0"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  {movie.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMovie(movie._id, movie.title);
                  }}
                  className="flex-shrink-0 ml-2 text-red-600 hover:text-red-700 transition-colors z-10"
                  title="Delete Movie"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                {movie.releaseYear} • {movie.genre}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <i className="fas fa-star text-yellow-500 text-xs"></i>
                  <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">
                    {movie.rating || 'N/A'}
                  </span>
                </div>
                {movie.runtime && (
                  <span className="text-gray-400 dark:text-gray-500 text-xs">
                    {movie.runtime} min
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                {movie.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminBrowse;

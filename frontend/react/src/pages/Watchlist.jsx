import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, watchedMovies, loading, removeFromWatchlist, markAsWatched } = useWatchlist();
  const [activeFilter, setActiveFilter] = useState('newest-added');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine watchlist and watched movies
  const allMovies = useMemo(() => {
    return [...watchlist, ...watchedMovies];
  }, [watchlist, watchedMovies]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let result = [...allMovies];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(movie => 
        movie.title?.toLowerCase().includes(query) ||
        movie.year?.toString().includes(query)
      );
    }

    // Apply sorting
    switch (activeFilter) {
      case 'newest-added':
        result.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
        break;
      case 'oldest-added':
        result.sort((a, b) => new Date(a.addedAt || 0) - new Date(b.addedAt || 0));
        break;
      case 'release-date':
        result.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      default:
        break;
    }

    return result;
  }, [allMovies, searchQuery, activeFilter]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemove = async (e, movieId) => {
    e.stopPropagation();
    await removeFromWatchlist(movieId);
  };

  const handleMarkAsWatched = async (e, movieId) => {
    e.stopPropagation();
    await markAsWatched(movieId);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full mt-16 sm:mt-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Watchlist</h1>
            <p className="text-gray-600 dark:text-gray-400">Keep track of movies you want to watch.</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveFilter('newest-added')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'newest-added'
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Recently Added
            </button>
            <button
              onClick={() => setActiveFilter('oldest-added')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'oldest-added'
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Oldest Added
            </button>
            <button
              onClick={() => setActiveFilter('release-date')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'release-date'
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Release Date
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by movie name or year..."
              className="w-full px-4 py-3 pl-12 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Empty State */}
        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <i className="far fa-bookmark text-4xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No movies found' : 'Your watchlist is empty'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
              {searchQuery
                ? 'Try adjusting your search to find what you\'re looking for.'
                : 'Looks like you haven\'t added any movies yet. Explore our collection to find something to watch!'}
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="bg-black dark:bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          /* Movie Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => {
              const movieId = movie.id || movie._id;
              const year = movie.releaseYear || movie.year || 'N/A';
              const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
              const isWatched = watchedMovies.some(m => (m.id || m._id) === movieId);

              return (
                <div
                  key={movieId}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative cursor-pointer"
                  onClick={() => handleMovieClick(movieId)}
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white text-xs">
                        No Image
                      </div>
                    )}
                    
                    {/* Watched Badge */}
                    {isWatched && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <i className="fas fa-check"></i> Watched
                      </span>
                    )}

                    {/* Hover Overlay with Buttons */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                      <button
                        onClick={(e) => handleMarkAsWatched(e, movieId)}
                        className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 shadow-lg"
                      >
                        <i className="fas fa-check-circle"></i> {isWatched ? 'Watched' : 'Mark as Watched'}
                      </button>
                      <button
                        onClick={(e) => handleRemove(e, movieId)}
                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 shadow-lg"
                      >
                        <i className="fas fa-trash-alt"></i> Remove
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate mb-1 text-lg">
                      {movie.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{year}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {movie.addedAt ? new Date(movie.addedAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Watchlist;

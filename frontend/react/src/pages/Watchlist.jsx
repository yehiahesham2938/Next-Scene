import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from "framer-motion";

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, watchedMovies, loading, removeFromWatchlist, markAsWatched } = useWatchlist();
  const [activeFilter, setActiveFilter] = useState('newest-added');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'to-watch', label: 'To Watch' },
    { id: 'watched', label: 'Watched' }
  ];

  // Filter button configuration
  const filterButtons = [
    { id: 'newest-added', label: 'Recently Added' },
    { id: 'oldest-added', label: 'Oldest Added' },
    { id: 'release-date', label: 'Release Date' }
  ];

  // Combine watchlist and watched movies
  const allMovies = useMemo(() => {
    return [...watchlist, ...watchedMovies];
  }, [watchlist, watchedMovies]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let result = [...allMovies];

    // Apply tab filter
    if (selectedTab === 'to-watch') {
      result = result.filter(movie => {
        const movieId = movie.id || movie._id;
        return !watchedMovies.some(m => (m.id || m._id) === movieId);
      });
    } else if (selectedTab === 'watched') {
      result = result.filter(movie => {
        const movieId = movie.id || movie._id;
        return watchedMovies.some(m => (m.id || m._id) === movieId);
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(movie => 
        movie.title?.toLowerCase().includes(query) ||
        movie.releaseYear?.toString().includes(query)
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
        result.sort((a, b) => {
          const yearA = parseInt(a.releaseYear || 0);
          const yearB = parseInt(b.releaseYear || 0);
          return yearB - yearA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [allMovies, searchQuery, activeFilter, selectedTab, watchedMovies]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemove = async (e, movieId) => {
    e.stopPropagation();
    await removeFromWatchlist(movieId);
  };

  const handleMarkAsWatched = async (e, movieId, isCurrentlyWatched) => {
    e.stopPropagation();
    await markAsWatched(movieId, !isCurrentlyWatched);
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
          <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg inline-flex">
            <ul className="flex gap-1 list-none m-0 p-0">
              {filterButtons.map((filter) => (
                <motion.li
                  key={filter.id}
                  initial={false}
                  animate={{
                    backgroundColor:
                      filter.id === activeFilter 
                        ? 'rgb(255 255 255 / 1)' 
                        : 'rgb(255 255 255 / 0)',
                  }}
                  className="relative px-4 py-2.5 rounded-md cursor-pointer select-none transition-colors"
                  style={{
                    color: filter.id === activeFilter 
                      ? 'rgb(17 24 39)' 
                      : 'rgb(107 114 128)',
                  }}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <span className="flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap">
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                  </span>
                  {filter.id === activeFilter && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                      layoutId="filterUnderline"
                      id="filterUnderline"
                    />
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Animated Tabs */}
        <div className="mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg inline-flex w-full max-w-md">
            <ul className="flex w-full gap-1">
              {tabs.map((tab) => (
                <motion.li
                  key={tab.id}
                  initial={false}
                  animate={{
                    backgroundColor:
                      tab.id === selectedTab 
                        ? 'rgb(255 255 255 / 1)' 
                        : 'rgb(255 255 255 / 0)',
                  }}
                  className="relative flex-1 px-4 py-2.5 rounded-md cursor-pointer select-none transition-colors list-none"
                  style={{
                    color: tab.id === selectedTab 
                      ? 'rgb(17 24 39)' 
                      : 'rgb(107 114 128)',
                  }}
                  onClick={() => setSelectedTab(tab.id)}
                >
                  <span className="flex items-center justify-center gap-2 font-medium text-sm">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                  {tab.id === selectedTab && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                      layoutId="underline"
                      id="underline"
                    />
                  )}
                </motion.li>
              ))}
            </ul>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
            {filteredMovies.map((movie) => {
              const movieId = movie.id || movie._id;
              const year = movie.releaseYear || movie.year || 'N/A';
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
                        onClick={(e) => handleMarkAsWatched(e, movieId, isWatched)}
                        className={`${
                          isWatched 
                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white px-4 py-2 rounded-full transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 shadow-lg`}
                      >
                        <i className={`fas ${isWatched ? 'fa-undo' : 'fa-check-circle'}`}></i> 
                        {isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
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
          </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default Watchlist;

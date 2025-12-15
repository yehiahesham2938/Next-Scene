import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, watchedMovies, loading, markAsWatched, removeFromWatchlist } = useWatchlist();

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Watchlist</h1>

      {/* To Watch Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">To Watch</h2>
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {watchlist.map((movie) => (
              <div key={movie.id || movie._id} className="relative">
                <MovieCard movie={movie} onClick={handleMovieClick} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsWatched(movie.id || movie._id);
                    }}
                    className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
                    title="Mark as watched"
                  >
                    <i className="fa-solid fa-check text-xs"></i>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(movie.id || movie._id);
                    }}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                    title="Remove"
                  >
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your watchlist is empty</p>
            <Button to="/browse">Browse Movies</Button>
          </div>
        )}
      </div>

      {/* Watched Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Watched ({watchedMovies.length})
        </h2>
        {watchedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {watchedMovies.map((movie) => (
              <MovieCard key={movie.id || movie._id} movie={movie} onClick={handleMovieClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No watched movies yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;

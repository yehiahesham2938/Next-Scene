import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  PageContainer,
  PrimaryButton,
  SecondaryButton,
} from '../components';
import { getMovieById } from '../utils/movieData';
import { useLocalStorage } from '../hooks';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useLocalStorage('watchlist', []);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Get movie data
  const movie = getMovieById(id);

  // Check if movie is in watchlist
  useEffect(() => {
    if (movie) {
      setIsInWatchlist(watchlist.some((item) => item.id === movie.id));
    }
  }, [movie, watchlist]);

  // Handle add/remove from watchlist
  const handleToggleWatchlist = () => {
    if (!movie) return;

    if (isInWatchlist) {
      // Remove from watchlist
      setWatchlist(watchlist.filter((item) => item.id !== movie.id));
    } else {
      // Add to watchlist
      setWatchlist([...watchlist, { id: movie.id, title: movie.title, year: movie.year, rating: movie.rating, poster: movie.poster }]);
    }
  };

  // If movie not found, show error
  if (!movie) {
    return (
      <PageContainer className="pb-20 md:pb-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Movie Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The movie you're looking for doesn't exist.</p>
          <SecondaryButton onClick={() => navigate('/')}>Go to Dashboard</SecondaryButton>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pb-20 md:pb-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="w-full aspect-[2/3] bg-gray-400 dark:bg-gray-600 rounded-lg flex items-center justify-center text-white">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span>Movie Poster</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {movie.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <div className="flex items-center gap-1 text-yellow-500">
              <span>⭐</span>
              <span className="text-gray-900 dark:text-white font-semibold">{movie.rating}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Plot */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Plot
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {movie.plot}
            </p>
          </div>

          {/* Director */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Director
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{movie.director}</p>
          </div>

          {/* Cast */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cast
            </h3>
            <div className="flex flex-wrap gap-2">
              {movie.cast.map((actor) => (
                <span
                  key={actor}
                  className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm border border-gray-200 dark:border-gray-700"
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <PrimaryButton onClick={handleToggleWatchlist}>
              {isInWatchlist ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  In Watchlist
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Add to Watchlist
                </>
              )}
            </PrimaryButton>
            <SecondaryButton onClick={() => alert('Play trailer')}>
              Watch Trailer
            </SecondaryButton>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default MovieDetails;

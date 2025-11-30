import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  SectionHeader,
  MovieCard,
  SecondaryButton,
} from '../components';
import { useLocalStorage } from '../hooks';

const Watchlist = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useLocalStorage('watchlist', []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemoveFromWatchlist = (movieId) => {
    setWatchlist(watchlist.filter((movie) => movie.id !== movieId));
  };

  return (
    <PageContainer className="pb-20 md:pb-8">
      <SectionHeader
        title="My Watchlist"
        subtitle={`${watchlist.length} movies saved to watch later`}
      />

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {watchlist.map((movie) => (
            <div key={movie.id} className="relative">
              <MovieCard
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                onClick={() => handleMovieClick(movie.id)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromWatchlist(movie.id);
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                title="Remove from watchlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding movies you want to watch later
          </p>
          <SecondaryButton onClick={() => navigate('/search')}>
            Browse Movies
          </SecondaryButton>
        </div>
      )}
    </PageContainer>
  );
};

export default Watchlist;

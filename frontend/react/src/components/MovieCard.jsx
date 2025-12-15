import PropTypes from 'prop-types';
import { formatRating } from '../utils/helpers';

const MovieCard = ({ movie, onClick }) => {
  return (
    <div
      className="movie-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-md"
      onClick={() => onClick && onClick(movie.id || movie._id)}
    >
      <img
        src={movie.poster || '/placeholder-movie.jpg'}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {movie.year || movie.releaseYear || 'N/A'}
          </span>
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-star text-yellow-500 text-sm"></i>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatRating(movie.rating)}
            </span>
          </div>
        </div>
        {movie.genre && (
          <div className="mt-2">
            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              {movie.genre.split(',')[0].trim()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    poster: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    releaseYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rating: PropTypes.number,
    genre: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default MovieCard;

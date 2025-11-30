import PropTypes from 'prop-types';

const MovieCard = ({
  title,
  year,
  rating,
  poster,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 ${className}`}
    >
      <div className="w-full h-48 md:h-64 bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white transition-colors overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm">Movie Poster</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate transition-colors">
          {title}
        </h3>
        {year && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 transition-colors">
            {year}
          </p>
        )}
        {rating && (
          <div className="flex items-center gap-1 text-yellow-500">
            <span>⭐</span>
            <span className="text-gray-700 dark:text-gray-300 text-sm transition-colors">
              {rating}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  poster: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default MovieCard;

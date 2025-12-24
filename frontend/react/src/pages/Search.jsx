import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { movieAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchMovies();
    }
  }, [query]);

  const searchMovies = async () => {
    try {
      setLoading(true);
      const data = await movieAPI.search(query);
      setMovies(data);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-14 sm:mt-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Search Results for "{query}"
      </h1>

      {loading ? (
        <LoadingSpinner />
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={{ ...movie, id: movie._id }} onClick={handleMovieClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No movies found for your search.</p>
        </div>
      )}
    </div>
  );
};

export default Search;

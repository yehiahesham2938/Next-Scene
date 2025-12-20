import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieAPI, adminAPI } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { watchlist, watchedMovies, addToWatchlist, removeFromWatchlist } = useWatchlist();
  
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getById(id);
      setMovie(data);
      
      // Fetch similar movies based on genre
      if (data.genre) {
        await fetchSimilarMovies(data.genre, data._id);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarMovies = async (genre, excludeId) => {
    try {
      const allMovies = await movieAPI.getAll();
      const primaryGenre = genre.split(',')[0].trim().toLowerCase();
      
      const similar = allMovies
        .filter(m => {
          if (m._id === excludeId) return false;
          if (!m.genre) return false;
          const movieGenres = m.genre.split(',').map(g => g.trim().toLowerCase());
          return movieGenres.includes(primaryGenre);
        })
        .slice(0, 4);
      
      setSimilarMovies(similar);
    } catch (error) {
      console.error('Error fetching similar movies:', error);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    // If already an embed URL, return as is
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Return original URL if not YouTube
    return url;
  };

  const isInWatchlist = () => {
    return [...watchlist, ...watchedMovies].some(
      m => m.id === movie?._id || m.title === movie?.title
    );
  };

  const handleWatchlistToggle = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (isAdmin) {
      await handleDeleteMovie();
      return;
    }

    const inWatchlist = isInWatchlist();
    
    if (inWatchlist) {
      await removeFromWatchlist(movie._id);
    } else {
      await addToWatchlist(movie._id);
    }
  };

  const handleDeleteMovie = async () => {
    if (!confirm(`Are you sure you want to delete "${movie.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminAPI.deleteMovie(movie._id);
      alert('Movie deleted successfully');
      navigate('/admin/browse');
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie: ' + error.message);
    }
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16 sm:mt-0">
        <p className="text-center text-gray-600 dark:text-gray-400">Movie not found</p>
      </div>
    );
  }

  const year = movie.year || movie.releaseYear || movie.releaseDate?.split('-')[0] || 'N/A';
  const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
  const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
  const genres = movie.genre ? movie.genre.split(',').map(g => g.trim()) : [];
  const cast = movie.mainCast ? movie.mainCast.split(',').map(c => c.trim()) : [];
  const inWatchlist = isInWatchlist();

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="text-gray-700 dark:text-gray-300">
            <i className="fas fa-arrow-left text-xl"></i>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Movie Details</h1>
          {isAdmin ? (
            <button 
              onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
              className="text-blue-600 dark:text-blue-400"
            >
              <i className="fas fa-edit text-xl"></i>
            </button>
          ) : (
            <button className="text-gray-700 dark:text-gray-300">
              <i className="fas fa-ellipsis-v text-xl"></i>
            </button>
          )}
        </div>
      </header>

      {/* Breadcrumb (Desktop only) */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <button onClick={() => navigate('/')} className="hover:text-black dark:hover:text-white">Home</button>
          <i className="fas fa-chevron-right text-xs"></i>
          <button onClick={() => navigate('/browse')} className="hover:text-black dark:hover:text-white">Movies</button>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black dark:text-white font-medium">{movie.title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-4 pb-8 mt-16 md:mt-0">
        <div className="md:flex gap-8 mb-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="w-full aspect-[2/3] bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center text-white mb-4 overflow-hidden">
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-lg">No Poster</span>
              )}
            </div>
            <button
              onClick={handleWatchlistToggle}
              className={`w-full py-3 rounded-lg mb-3 transition flex items-center justify-center gap-2 ${
                isAdmin
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : inWatchlist
                  ? 'bg-green-600 text-white'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
              }`}
            >
              {isAdmin ? (
                <>
                  <i className="fas fa-trash"></i>
                  Delete Movie
                </>
              ) : inWatchlist ? (
                <>
                  <i className="fas fa-check"></i>
                  In Watchlist
                </>
              ) : (
                <>
                  <i className="far fa-heart"></i>
                  Add to Watchlist
                </>
              )}
            </button>
            {isAdmin && (
              <button
                onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mb-3 transition flex items-center justify-center gap-2"
              >
                <i className="fas fa-edit"></i>
                Edit Movie
              </button>
            )}
            <button
              onClick={() => switchTab('trailer')}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-play"></i>
              Watch Trailer
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Poster */}
            <div className="md:hidden w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center text-white mb-4 overflow-hidden">
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-lg">No Poster</span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <i className="fas fa-star text-yellow-500"></i>
                <span className="font-semibold text-black dark:text-white">{rating}</span>
                <span>/10</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>{year}</span>
              <span className="text-gray-400">•</span>
              <span>{runtime}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                  {genre}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex gap-8">
                <button
                  onClick={() => switchTab('overview')}
                  className={`py-3 text-sm transition-colors ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-black dark:border-white font-semibold text-black dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => switchTab('cast')}
                  className={`py-3 text-sm transition-colors ${
                    activeTab === 'cast'
                      ? 'border-b-2 border-black dark:border-white font-semibold text-black dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Cast
                </button>
                <button
                  onClick={() => switchTab('reviews')}
                  className={`py-3 text-sm transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-black dark:border-white font-semibold text-black dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => switchTab('trailer')}
                  className={`py-3 text-sm transition-colors ${
                    activeTab === 'trailer'
                      ? 'border-b-2 border-black dark:border-white font-semibold text-black dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Trailer
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Summary</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {movie.description || 'No description available.'}
                  </p>

                  <div className="mt-6 space-y-3">
                    {movie.director && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Director</span>
                        <span className="font-medium text-gray-900 dark:text-white">{movie.director}</span>
                      </div>
                    )}
                    {movie.writer && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Writer</span>
                        <span className="font-medium text-gray-900 dark:text-white">{movie.writer}</span>
                      </div>
                    )}
                    {movie.producer && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Producer</span>
                        <span className="font-medium text-gray-900 dark:text-white">{movie.producer}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cast Tab */}
              {activeTab === 'cast' && (
                <div>
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Main Cast</h3>
                  {cast.length > 0 ? (
                    <div className="space-y-4">
                      {cast.map((actor, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                            <i className="fas fa-user text-gray-500 dark:text-gray-400"></i>
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-gray-900 dark:text-white">{actor}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">No cast information available.</p>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">User Reviews</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No reviews available yet.</p>
                </div>
              )}

              {/* Trailer Tab */}
              {activeTab === 'trailer' && (
                <div>
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Official Trailer</h3>
                  {movie.trailerUrl ? (
                    <div className="w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <iframe
                        className="w-full h-full"
                        src={getYouTubeEmbedUrl(movie.trailerUrl)}
                        title={`${movie.title} Trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">No trailer available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Fixed Buttons */}
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3 z-40">
          <button
            onClick={handleWatchlistToggle}
            className={`flex-1 py-3 rounded-lg transition flex items-center justify-center gap-2 ${
              isAdmin
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : inWatchlist
                ? 'bg-green-600 text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isAdmin ? (
              <>
                <i className="fas fa-trash"></i>
                Delete
              </>
            ) : inWatchlist ? (
              <>
                <i className="fas fa-check"></i>
                In Watchlist
              </>
            ) : (
              <>
                <i className="far fa-heart"></i>
                Add to Watchlist
              </>
            )}
          </button>
          <button
            onClick={() => switchTab('trailer')}
            className="w-12 h-12 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <i className="fas fa-play text-xl text-gray-700 dark:text-gray-300"></i>
          </button>
        </div>

        {/* More Like This Section */}
        <section className="mt-12 mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">More Like This</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {similarMovies.length > 0 ? (
              similarMovies.map((similar) => (
                <button
                  key={similar._id}
                  onClick={() => navigate(`/movie/${similar._id}`)}
                  className="cursor-pointer text-left"
                >
                  <div className="w-full aspect-[2/3] bg-gray-300 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center text-white text-xs overflow-hidden">
                    {similar.poster ? (
                      <img src={similar.poster} alt={similar.title} className="w-full h-full object-cover" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white line-clamp-1">{similar.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>{similar.year || similar.releaseYear || 'N/A'}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <i className="fas fa-star text-yellow-500 text-xs"></i>
                      <span>{similar.rating ? similar.rating.toFixed(1) : 'N/A'}</span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="col-span-full text-gray-600 dark:text-gray-400 text-sm">No similar movies found.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default MovieDetails;

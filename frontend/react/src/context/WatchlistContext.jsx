import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import { watchlistAPI } from '../services/api';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
      setWatchedMovies([]);
    }
  }, [user]);

  const fetchWatchlist = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await watchlistAPI.get(user._id || user.id);
      
      if (data && data.movies) {
        const watched = data.movies.filter(m => m.watched).map(m => ({
          id: m.movieId._id,
          ...m.movieId,
        }));
        const unwatched = data.movies.filter(m => !m.watched).map(m => ({
          id: m.movieId._id,
          ...m.movieId,
        }));
        
        setWatchedMovies(watched);
        setWatchlist(unwatched);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movieId) => {
    if (!user) return;
    
    try {
      await watchlistAPI.add(user._id || user.id, movieId);
      await fetchWatchlist();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    if (!user) return;
    
    try {
      await watchlistAPI.remove(user._id || user.id, movieId);
      await fetchWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const markAsWatched = async (movieId) => {
    if (!user) return;
    
    try {
      await watchlistAPI.markWatched(user._id || user.id, movieId);
      await fetchWatchlist();
    } catch (error) {
      console.error('Error marking as watched:', error);
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(m => m.id === movieId || m._id === movieId);
  };

  const isWatched = (movieId) => {
    return watchedMovies.some(m => m.id === movieId || m._id === movieId);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watchedMovies,
        loading,
        addToWatchlist,
        removeFromWatchlist,
        markAsWatched,
        isInWatchlist,
        isWatched,
        fetchWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

WatchlistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WatchlistContext;

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
      
      if (data && Array.isArray(data)) {
        const watched = data.filter(item => item.watched).map(item => ({
          id: item.movieId?._id,
          ...item.movieId,
        }));
        const unwatched = data.filter(item => !item.watched).map(item => ({
          id: item.movieId?._id,
          ...item.movieId,
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
    if (!user) {
      console.error('No user found when trying to remove from watchlist');
      return;
    }
    
    try {
      console.log('Removing movie from watchlist:', { userId: user._id || user.id, movieId });
      const result = await watchlistAPI.remove(user._id || user.id, movieId);
      console.log('Remove result:', result);
      await fetchWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove from watchlist: ' + error.message);
    }
  };

  const markAsWatched = async (movieId, watched = true) => {
    if (!user) return;
    
    try {
      await watchlistAPI.markWatched(user._id || user.id, movieId, watched);
      await fetchWatchlist();
    } catch (error) {
      console.error('Error marking as watched:', error);
      throw error;
    }
  };

  const toggleWatched = async (movieId) => {
    if (!user) return;
    
    const currentlyWatched = isWatched(movieId);
    await markAsWatched(movieId, !currentlyWatched);
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
        toggleWatched,
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

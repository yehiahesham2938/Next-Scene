import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('watchlist');
      const savedWatched = localStorage.getItem('watchedMovies');
      
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
      if (savedWatched) {
        setWatchedMovies(JSON.parse(savedWatched));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error('Error saving watchlist:', error);
    }
  }, [watchlist]);

  // Save to localStorage whenever watched movies change
  useEffect(() => {
    try {
      localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
    } catch (error) {
      console.error('Error saving watched movies:', error);
    }
  }, [watchedMovies]);

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const markAsWatched = (movie) => {
    setWatchedMovies((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
    // Remove from watchlist if it's there
    removeFromWatchlist(movie.id);
  };

  const markAsUnwatched = (movieId) => {
    setWatchedMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isWatched = (movieId) => {
    return watchedMovies.some((m) => m.id === movieId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  const clearWatched = () => {
    setWatchedMovies([]);
  };

  const value = {
    watchlist,
    watchedMovies,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    markAsWatched,
    markAsUnwatched,
    isWatched,
    clearWatchlist,
    clearWatched,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

WatchlistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

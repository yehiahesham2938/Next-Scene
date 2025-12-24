import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../services/api';

const SearchAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Search movies, actors, directors...",
  className = "",
  onSelect 
}) => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [cachedMovies, setCachedMovies] = useState(null);
  const [cacheTime, setCacheTime] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const DEBOUNCE_DELAY = 300;
  const MIN_QUERY_LENGTH = 2;
  const MAX_SUGGESTIONS = 8;

  // Fetch movies for autocomplete with caching
  const fetchMoviesForAutocomplete = useCallback(async () => {
    // Check if cache is still valid
    if (cachedMovies && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      return cachedMovies;
    }

    try {
      const movies = await movieAPI.getAll();
      setCachedMovies(movies);
      setCacheTime(Date.now());
      return movies;
    } catch (error) {
      console.error('Error fetching movies for autocomplete:', error);
      return [];
    }
  }, [cachedMovies, cacheTime]);

  // Search across multiple fields
  const searchMovies = useCallback((query, movies) => {
    if (!query || query.length < MIN_QUERY_LENGTH) return [];

    const searchLower = query.toLowerCase();
    const filtered = movies.filter(movie => {
      // Search in title
      if (movie.title?.toLowerCase().includes(searchLower)) return true;
      
      // Search in genres
      if (movie.genre?.toLowerCase().includes(searchLower)) return true;
      
      // Search in director
      if (movie.director?.toLowerCase().includes(searchLower)) return true;
      
      // Search in cast
      if (movie.cast?.some(actor => actor.toLowerCase().includes(searchLower))) return true;
      
      return false;
    });

    return filtered.slice(0, MAX_SUGGESTIONS);
  }, []);

  // Handle input change with debouncing
  const handleInputChange = useCallback(async (newValue) => {
    onChange(newValue);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Don't show dropdown for short queries
    if (newValue.length < MIN_QUERY_LENGTH) {
      setShowDropdown(false);
      setSuggestions([]);
      return;
    }

    // Debounce the search
    debounceTimer.current = setTimeout(async () => {
      const movies = await fetchMoviesForAutocomplete();
      const results = searchMovies(newValue, movies);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      setSelectedIndex(-1);
    }, DEBOUNCE_DELAY);
  }, [onChange, fetchMoviesForAutocomplete, searchMovies]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (movie) => {
    setShowDropdown(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    
    if (onSelect) {
      onSelect(movie);
    }
    
    navigate(`/movie/${movie._id}`);
  };

  // Handle input focus
  const handleFocus = async () => {
    if (value && value.length >= MIN_QUERY_LENGTH) {
      const movies = await fetchMoviesForAutocomplete();
      const results = searchMovies(value, movies);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format year from releaseYear or releaseDate
  const getYear = (movie) => {
    return movie.releaseYear || movie.year || movie.releaseDate?.split('-')[0] || 'N/A';
  };

  // Get first genre
  const getGenre = (movie) => {
    if (!movie.genre) return '';
    return movie.genre.split(',')[0].trim();
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls="search-suggestions"
        aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
      />
      
      {showDropdown && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          ref={dropdownRef}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-[320px] overflow-y-auto"
        >
          {suggestions.map((movie, index) => (
            <li
              key={movie._id}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSelectSuggestion(movie)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                index === selectedIndex
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-750'
              }`}
            >
              {/* Movie Poster */}
              <div className="flex-shrink-0 w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    <i className="fas fa-film"></i>
                  </div>
                )}
              </div>

              {/* Movie Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                  {movie.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>{getYear(movie)}</span>
                  {getGenre(movie) && (
                    <>
                      <span>•</span>
                      <span>{getGenre(movie)}</span>
                    </>
                  )}
                </div>
                {movie.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <i className="fas fa-star text-yellow-500 text-xs"></i>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {movie.rating}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && suggestions.length === 0 && value.length >= MIN_QUERY_LENGTH && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500 dark:text-gray-400 text-sm"
        >
          No results found
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden sm:flex bg-white dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-film text-gray-800 dark:text-gray-200 text-3xl transition-colors"></i>
            <Link to="/" className="text-gray-900 dark:text-white text-lg font-bold transition-colors">
              Next-Scene
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-8 items-center">
            <Link
              to="/"
              className={`${
                isActive('/') ? 'text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'
              } hover:text-black dark:hover:text-white transition-colors`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`${
                    isActive('/dashboard') ? 'text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'
                  } hover:text-black dark:hover:text-white transition-colors`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/watchlist"
                  className={`${
                    isActive('/watchlist') ? 'text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'
                  } hover:text-black dark:hover:text-white transition-colors`}
                >
                  My Watchlist
                </Link>
              </>
            )}
            <Link
              to="/browse"
              className={`${
                isActive('/browse') ? 'text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'
              } hover:text-black dark:hover:text-white transition-colors`}
            >
              Browse
            </Link>
            <Link
              to="/about"
              className={`${
                isActive('/about') ? 'text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'
              } hover:text-black dark:hover:text-white transition-colors`}
            >
              About us
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`${
                  isActive('/admin') ? 'text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'
                } hover:text-black dark:hover:text-white transition-colors`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Search Bar and Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <form onSubmit={handleSearch} className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-600 transition flex-shrink-0"
                >
                  <i className="fa-solid fa-user text-white text-sm"></i>
                </Link>
                <button
                  className="relative inline-flex items-center h-8 w-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 bg-gray-300 dark:bg-gray-700"
                  onClick={toggleTheme}
                  title="Toggle theme"
                >
                  <span
                    className="inline-flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out translate-x-1 dark:translate-x-[52px]"
                  >
                    {theme === 'dark' ? (
                      <i className="fa-solid fa-moon text-gray-800 text-xs"></i>
                    ) : (
                      <i className="fa-solid fa-sun text-yellow-500 text-xs"></i>
                    )}
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="bg-black dark:bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-600 transition whitespace-nowrap"
                >
                  Sign In
                </Link>
                <button
                  className="relative inline-flex items-center h-8 w-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 bg-gray-300 dark:bg-gray-700"
                  onClick={toggleTheme}
                  title="Toggle theme"
                >
                  <span
                    className="inline-flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out translate-x-1 dark:translate-x-[52px]"
                  >
                    {theme === 'dark' ? (
                      <i className="fa-solid fa-moon text-gray-800 text-xs"></i>
                    ) : (
                      <i className="fa-solid fa-sun text-yellow-500 text-xs"></i>
                    )}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sm:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-50 transition-colors">
        <div className="flex justify-between items-center px-4 py-3">
          <i className="fa-solid fa-film text-gray-800 dark:text-gray-200 text-2xl transition-colors"></i>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
            Next-Scene
          </h1>

          {user ? (
            <Link to="/profile" className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <i className="fa-solid fa-user text-gray-600 dark:text-gray-300 text-xs"></i>
            </Link>
          ) : (
            <Link
              to="/signin"
              className="text-sm bg-black dark:bg-gray-700 text-white px-3 py-1 rounded"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchAutocomplete from '../components/SearchAutocomplete';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

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
    navigate('/signin');
  };

  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsSidebarOpen(false);
    }, 100);
  };

  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden sm:block fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700">
            <i className="fa-solid fa-film text-2xl text-gray-800 dark:text-gray-200 flex-shrink-0"></i>
            {isSidebarOpen && (
              <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                Next-Scene
              </span>
            )}
          </div>

          {/* Search Bar */}
          {isSidebarOpen && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search movies..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {/* <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> */}
              </svg>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            {user?.role === 'admin' ? (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                    isActive('/admin')
                      ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-gauge text-xl w-6 text-center flex-shrink-0"></i>
                  {isSidebarOpen && <span className="whitespace-nowrap">Dashboard</span>}
                </Link>
                <Link
                  to="/admin/add-movie"
                  className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                    isActive('/admin/add-movie')
                      ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-plus text-xl w-6 text-center flex-shrink-0"></i>
                  {isSidebarOpen && <span className="whitespace-nowrap">Add Movie</span>}
                </Link>
                <Link
                  to="/admin/browse"
                  className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                    isActive('/admin/browse')
                      ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-th text-xl w-6 text-center flex-shrink-0"></i>
                  {isSidebarOpen && <span className="whitespace-nowrap">Browse</span>}
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleHomeClick}
                  className={`w-full flex items-center gap-4 px-5 py-3 transition-colors ${
                    isActive('/')
                      ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-home text-xl w-6 text-center flex-shrink-0"></i>
                  {isSidebarOpen && <span className="whitespace-nowrap">Home</span>}
                </button>
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                        isActive('/dashboard')
                          ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <i className="fa-solid fa-gauge text-xl w-6 text-center flex-shrink-0"></i>
                      {isSidebarOpen && <span className="whitespace-nowrap">Dashboard</span>}
                    </Link>
                    <Link
                      to="/watchlist"
                      className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                        isActive('/watchlist')
                          ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <i className="fa-solid fa-bookmark text-xl w-6 text-center flex-shrink-0"></i>
                      {isSidebarOpen && <span className="whitespace-nowrap">Watchlist</span>}
                    </Link>
                  </>
                )}
                <Link
                  to="/browse"
                  className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                    isActive('/browse')
                      ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-th text-xl w-6 text-center flex-shrink-0"></i>
                  {isSidebarOpen && <span className="whitespace-nowrap">Browse</span>}
                </Link>
                <Link
                  to="/about"
                  className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                    isActive('/about')
                      ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-info-circle text-xl w-6 text-center flex-shrink-0"></i>
                  {isSidebarOpen && <span className="whitespace-nowrap">About Us</span>}
                </Link>
              </>
            )}
          </nav>

          {/* Theme Toggle (only for non-admin) */}
          {(!user || user?.role !== 'admin') && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-4 w-full px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                title="Toggle theme"
              >
                <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-xl w-6 text-center flex-shrink-0`}></i>
                {isSidebarOpen && <span className="whitespace-nowrap">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>}
              </button>
            </div>
          )}

          {/* Profile/Sign In */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="flex items-center gap-4 w-full px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <i className="fa-solid fa-user text-xl w-6 text-center flex-shrink-0"></i>
                  {isSidebarOpen && <span className="whitespace-nowrap">More Options</span>}
                </button>
                {showMoreOptions && isSidebarOpen && (
                  <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      onClick={() => setShowMoreOptions(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMoreOptions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="flex items-center gap-4 px-5 py-3 bg-black dark:bg-gray-700 text-white rounded hover:bg-gray-800 dark:hover:bg-gray-600 transition justify-center"
              >
                <i className="fa-solid fa-sign-in-alt text-xl flex-shrink-0"></i>
                {isSidebarOpen && <span className="whitespace-nowrap">Sign In</span>}
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 transition-colors">
        <div className="flex justify-around items-center py-3">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 ${
              isActive('/') ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <i className="fa-solid fa-home text-xl"></i>
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/browse"
            className={`flex flex-col items-center gap-1 ${
              isActive('/browse') ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <i className="fa-solid fa-th text-xl"></i>
            <span className="text-xs">Browse</span>
          </Link>
          {user && (
            <Link
              to="/watchlist"
              className={`flex flex-col items-center gap-1 ${
                isActive('/watchlist') ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <i className="fa-solid fa-bookmark text-xl"></i>
              <span className="text-xs">Watchlist</span>
            </Link>
          )}
          <Link
            to={user ? '/profile' : '/signin'}
            className={`flex flex-col items-center gap-1 ${
              isActive('/profile') || isActive('/signin') ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <i className="fa-solid fa-user text-xl"></i>
            <span className="text-xs">{user ? 'Profile' : 'Sign In'}</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;

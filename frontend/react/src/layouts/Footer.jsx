import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Footer Navigation */}
      <nav className={`sm:hidden fixed bottom-0 left-0 right-0 border-t shadow-lg z-50 transition-colors ${
        user?.role === 'admin' 
          ? 'bg-white border-gray-200' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`} aria-label="Mobile footer navigation">
        <div className="flex justify-around items-center py-3">
          {user?.role === 'admin' ? (
            <>
              <Link
                to="/admin"
                className={`flex flex-col items-center gap-1 ${
                  isActive('/admin') ? 'text-gray-900 font-bold' : 'text-gray-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs">Dashboard</span>
              </Link>

              <Link
                to="/admin/browse"
                className={`flex flex-col items-center gap-1 ${
                  isActive('/admin/browse') ? 'text-gray-900 font-bold' : 'text-gray-600'
                }`}
              >
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg> */}
                <i class="fa-solid fa-th text-xl w-6 text-center flex-shrink-0"></i>
                <span className="text-xs">Browse</span>
              </Link>

              <Link
                to="/profile"
                className={`flex flex-col items-center gap-1 ${
                  isActive('/profile') ? 'text-gray-900 font-bold' : 'text-gray-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs">Profile</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`flex flex-col items-center gap-1 ${
                  isActive('/') ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs">Home</span>
              </Link>

              <Link
                to="/browse"
                className={`flex flex-col items-center gap-1 ${
                  isActive('/browse') ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg> */}
                <i class="fa-solid fa-th text-xl w-6 text-center flex-shrink-0"></i>
                <span className="text-xs">Browse</span>
              </Link>

              {user && (
                <>
                  <Link
                    to="/watchlist"
                    className={`flex flex-col items-center gap-1 ${
                      isActive('/watchlist') ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="text-xs">Watchlist</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className={`flex flex-col items-center gap-1 ${
                      isActive('/dashboard') ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 4 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs">Dashboard</span>
                  </Link>

                  <Link
                    to="/profile"
                    className={`flex flex-col items-center gap-1 ${
                      isActive('/profile') ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs">Profile</span>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Desktop Footer */}
      <footer className="hidden sm:block bg-black text-white py-12 mt-auto" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-film text-white text-3xl" aria-hidden="true"></i>
                <Link to="/" className="text-white text-lg font-bold" aria-label="Next-Scene home">
                  Next-Scene
                </Link>
              </div>
              <p className="text-gray-400 text-xs">
                Your ultimate destination for movie discovery and management.
              </p>
            </div>

            <nav aria-label="Product links">
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <a href="NotFound" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="NotFound" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="NotFound" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </nav>

            <nav aria-label="Company links">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <a href="NotFound" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="NotFound" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </nav>

            <section aria-label="Social media links">
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                {/* Twitter Icon */}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-150" aria-label="Follow us on Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22.46 6c-0.63 0.28-1.31 0.47-2.01 0.54 0.72-0.43 1.28-1.11 1.54-1.92-0.68 0.4-1.44 0.69-2.24 0.85-0.64-0.68-1.55-1.1-2.56-1.1-1.93 0-3.5 1.57-3.5 3.5 0 0.27 0.03 0.54 0.09 0.8-2.91-0.15-5.49-1.54-7.22-3.66-0.3 0.52-0.47 1.13-0.47 1.77 0 1.22 0.62 2.3 1.57 2.92-0.58-0.02-1.12-0.18-1.59-0.44v0.04c0 1.7 1.21 3.12 2.8 3.44-0.29 0.08-0.59 0.12-0.9 0.12-0.22 0-0.44-0.02-0.65-0.06 0.44 1.39 1.73 2.41 3.26 2.44-1.2 0.94-2.72 1.5-4.38 1.5-0.29 0-0.57-0.02-0.85-0.06 1.55 0.99 3.38 1.57 5.37 1.57 6.45 0 9.98-5.33 9.98-9.98 0-0.15 0-0.3-0.01-0.45 0.69-0.5 1.28-1.13 1.76-1.85z"/>
                  </svg>
                </a>
                {/* Facebook Icon */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-150" aria-label="Follow us on Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.01c-5.52 0-10 4.49-10 10s4.48 10 10 10 10-4.49 10-10-4.48-10-10-10zm2 10h-2v7h-3v-7h-2v-3h2v-2c0-2.3 1.1-3 3-3h3v3h-3c-0.5 0-1 0.5-1 1v2h4l-1 3z"/>
                  </svg>
                </a>
                {/* Instagram Icon */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-150" aria-label="Follow us on Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2c2.75 0 3.09 0.01 4.16 0.06 0.92 0.04 1.48 0.2 2.05 0.41 0.59 0.21 1.05 0.49 1.51 0.95 0.46 0.46 0.74 0.92 0.95 1.51 0.21 0.57 0.37 1.13 0.41 2.05 0.05 1.07 0.06 1.41 0.06 4.16s-0.01 3.09-0.06 4.16c-0.04 0.92-0.2 1.48-0.41 2.05-0.21 0.59-0.49 1.05-0.95 1.51-0.46 0.46-0.92 0.74-1.51 0.95-0.57 0.21-1.13 0.37-2.05 0.41-1.07 0.05-1.41 0.06-4.16 0.06s-3.09-0.01-4.16-0.06c-0.92-0.04-1.48-0.2-2.05-0.41-0.59-0.21-1.05-0.49-1.51-0.95-0.46-0.46-0.74-0.92-0.95-1.51-0.21-0.57-0.37-1.13-0.41-2.05-0.05-1.07-0.06-1.41-0.06-4.16s0.01-3.09 0.06-4.16c0.04-0.92 0.2-1.48 0.41-2.05 0.21-0.59 0.49-1.05 0.95-1.51 0.46-0.46 0.92-0.74 1.51-0.95 0.57-0.21 1.13-0.37 2.05-0.41 1.07-0.05 1.41-0.06 4.16-0.06zm0 2.25c-2.48 0-2.77 0.01-3.75 0.06-0.89 0.04-1.37 0.19-1.74 0.34-0.47 0.17-0.84 0.38-1.22 0.76-0.38 0.38-0.59 0.75-0.76 1.22-0.15 0.37-0.3 0.85-0.34 1.74-0.05 0.98-0.06 1.27-0.06 3.75s0.01 2.77 0.06 3.75c0.04 0.89 0.19 1.37 0.34 1.74 0.17 0.47 0.38 0.84 0.76 1.22 0.38 0.38 0.75 0.59 1.22 0.76 0.37 0.15 0.85 0.3 1.74 0.34 0.98 0.05 1.27 0.06 3.75 0.06s2.77-0.01 3.75-0.06c0.89-0.04 1.37-0.19 1.74-0.34 0.47-0.17 0.84-0.38 1.22-0.76 0.38-0.38 0.59-0.75 0.76-1.22 0.15-0.37 0.3-0.85 0.34-1.74 0.05-0.98 0.06-1.27 0.06-3.75s-0.01-2.77-0.06-3.75c-0.04-0.89-0.19-1.37-0.34-1.74-0.17-0.47-0.38-0.84-0.76-1.22-0.38-0.38-0.75-0.59-1.22-0.76-0.37-0.15-0.85-0.3-1.74-0.34-0.98-0.05-1.27-0.06-3.75-0.06zM12 7.75c2.35 0 4.25 1.9 4.25 4.25s-1.9 4.25-4.25 4.25-4.25-1.9-4.25-4.25 1.9-4.25 4.25-4.25zM12 9.75c-1.24 0-2.25 1.01-2.25 2.25s1.01 2.25 2.25 2.25 2.25-1.01 2.25-2.25-1.01-2.25-2.25-2.25zM17.5 7a0.5 0.5 0 1 0 0 1 0.5 0.5 0 0 0 0-1z"/>
                  </svg>
                </a>
              </div>
            </section>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Next-Scene. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

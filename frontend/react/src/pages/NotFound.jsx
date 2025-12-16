import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center animate-bounce">
                <i className="fa-solid fa-film text-5xl text-gray-400 dark:text-gray-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            It might have been moved or deleted, or perhaps you mistyped the URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={user?.role === 'admin' ? '/admin' : '/'}
            className="bg-black dark:bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-home"></i>
            Go to Home
          </Link>
          
          <Link
            to="/browse"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-film"></i>
            Browse Movies
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-8 text-gray-300 dark:text-gray-700">
          <div className="text-6xl opacity-20">
            <i className="fa-solid fa-clapperboard"></i>
          </div>
          <div className="text-6xl opacity-20">
            <i className="fa-solid fa-popcorn"></i>
          </div>
          <div className="text-6xl opacity-20">
            <i className="fa-solid fa-ticket"></i>
          </div>
        </div>

        {/* Additional Help Text */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-600">
          <p>
            Need help? Try using the navigation menu or{' '}
            <Link to="/browse" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white underline">
              browse our movie collection
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

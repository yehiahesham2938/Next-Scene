import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import Button from '../components/Button';

const Profile = () => {
  const { user, logout } = useAuth();
  const { watchlist, watchedMovies } = useWatchlist();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.username || 'User'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="inline-block mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{watchlist.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Watchlist</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{watchedMovies.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Watched</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {watchlist.length + watchedMovies.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
          <Button variant="danger" onClick={handleLogout} className="w-full sm:w-auto">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

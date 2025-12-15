import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: user?.username || '',
    email: user?.email || '',
    bio: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', profileData);
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // TODO: Implement password update API call
    console.log('Updating password');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSignOut = () => {
    logout();
    navigate('/signin');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion API call
      console.log('Deleting account');
      logout();
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>

        <div className="flex flex-col sm:flex-row gap-8 mb-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user text-white text-3xl"></i>
            </div>
            <button className="text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Change Avatar
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  placeholder="your first name.."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  placeholder="your last name.."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
                placeholder="Your unique username.."
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder="Tell us about yourself..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm h-20 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection - Hidden for Admin */}
      {!isAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Theme</h2>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Appearance
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Choose your preferred theme mode
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Light</span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex items-center h-8 w-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}
                title="Toggle theme"
              >
                <span
                  className={`inline-flex items-center justify-center h-6 w-11 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                >
                  {theme === 'dark' ? (
                    <i className="fa-solid fa-moon text-gray-700 text-xs"></i>
                  ) : (
                    <i className="fa-solid fa-sun text-yellow-500 text-xs"></i>
                  )}
                </span>
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">Dark</span>
            </div>
          </div>
        </div>
      )}

      {/* Account Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Management</h2>

        {/* Change Password */}
        <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleUpdatePassword}
              className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Sign Out</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Sign out of your account on this device
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            <i className="fa-solid fa-right-from-bracket mr-2"></i>
            Sign Out
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Delete Account</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Permanently delete your account and all data
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="bg-gray-900 dark:bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 dark:hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

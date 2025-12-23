import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { isValidPassword } from '../utils/helpers';

const Profile = () => {
  const { user, logout, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    profilePicture: ''
  });

  const [loading, setLoading] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

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

  const handleSaveProfile = async () => {
    if (!user?.id) {
      showToast('User not found', 'error');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        dob: profileData.dob,
        profilePicture: profileData.profilePicture
      };

      const updatedUser = await authAPI.updateProfile(user.id, updateData);
      login(updatedUser); // Update user in context
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Profile update error:', error);
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user?.id) {
      showToast('User not found', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    const pwdCheck = isValidPassword(passwordData.newPassword);
    if (!pwdCheck.valid) {
      showToast(pwdCheck.message, 'error');
      return;
    }

    setLoading(true);
    try {
      await authAPI.updatePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
      showToast('Password updated successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password update error:', error);
      showToast(error.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
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
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center overflow-hidden">
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fa-solid fa-user text-white text-3xl"></i>
              )}
            </div>
            <label className="text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              Change Avatar
              <input 
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfileData({ ...profileData, profilePicture: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
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
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={profileData.dob}
                onChange={handleProfileChange}
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
                Full Name
              </label>
              <input
                type="text"
                value={user?.fullName || ''}
                disabled
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Full name cannot be changed
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection - Hidden for Admin */}
      {!isAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Theme</h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Appearance
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Choose your preferred theme mode
              </p>
            </div>
            
            {/* Theme Switcher */}
            <label className='themeSwitcherTwo shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-white dark:bg-gray-700 p-1 border border-gray-200 dark:border-gray-600'>
              <input
                type='checkbox'
                className='sr-only'
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <span
                className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium transition-colors ${
                  theme === 'light' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  className='mr-[6px] fill-current'
                >
                  <g clipPath='url(#clip0_3122_652)'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M8 0C8.36819 0 8.66667 0.298477 8.66667 0.666667V2C8.66667 2.36819 8.36819 2.66667 8 2.66667C7.63181 2.66667 7.33333 2.36819 7.33333 2V0.666667C7.33333 0.298477 7.63181 0 8 0ZM8 5.33333C6.52724 5.33333 5.33333 6.52724 5.33333 8C5.33333 9.47276 6.52724 10.6667 8 10.6667C9.47276 10.6667 10.6667 9.47276 10.6667 8C10.6667 6.52724 9.47276 5.33333 8 5.33333ZM4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8ZM8.66667 14C8.66667 13.6318 8.36819 13.3333 8 13.3333C7.63181 13.3333 7.33333 13.6318 7.33333 14V15.3333C7.33333 15.7015 7.63181 16 8 16C8.36819 16 8.66667 15.7015 8.66667 15.3333V14ZM2.3411 2.3424C2.60145 2.08205 3.02356 2.08205 3.28391 2.3424L4.23057 3.28906C4.49092 3.54941 4.49092 3.97152 4.23057 4.23187C3.97022 4.49222 3.54811 4.49222 3.28776 4.23187L2.3411 3.28521C2.08075 3.02486 2.08075 2.60275 2.3411 2.3424ZM12.711 11.7682C12.4506 11.5078 12.0285 11.5078 11.7682 11.7682C11.5078 12.0285 11.5078 12.4506 11.7682 12.711L12.7148 13.6577C12.9752 13.918 13.3973 13.918 13.6577 13.6577C13.918 13.3973 13.918 12.9752 13.6577 12.7148L12.711 11.7682ZM0 8C0 7.63181 0.298477 7.33333 0.666667 7.33333H2C2.36819 7.33333 2.66667 7.63181 2.66667 8C2.66667 8.36819 2.36819 8.66667 2 8.66667H0.666667C0.298477 8.66667 0 8.36819 0 8ZM14 7.33333C13.6318 7.33333 13.3333 7.63181 13.3333 8C13.3333 8.36819 13.6318 8.66667 14 8.66667H15.3333C15.7015 8.66667 16 8.36819 16 8C16 7.63181 15.7015 7.33333 15.3333 7.33333H14ZM4.23057 11.7682C4.49092 12.0285 4.49092 12.4506 4.23057 12.711L3.28391 13.6577C3.02356 13.918 2.60145 13.918 2.3411 13.6577C2.08075 13.3973 2.08075 12.9752 2.3411 12.7148L3.28776 11.7682C3.54811 11.5078 3.97022 11.5078 4.23057 11.7682ZM13.6577 3.28521C13.918 3.02486 13.918 2.60275 13.6577 2.3424C13.3973 2.08205 12.9752 2.08205 12.7148 2.3424L11.7682 3.28906C11.5078 3.54941 11.5078 3.97152 11.7682 4.23187C12.0285 4.49222 12.4506 4.49222 12.711 4.23187L13.6577 3.28521Z'
                    ></path>
                  </g>
                  <defs>
                    <clipPath id='clip0_3122_652'>
                      <rect width='16' height='16' fill='white'></rect>
                    </clipPath>
                  </defs>
                </svg>
                Light
              </span>
              <span
                className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium transition-colors ${
                  theme === 'dark' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  className='mr-[6px] fill-current'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M8.0547 1.67334C8.18372 1.90227 8.16622 2.18562 8.01003 2.39693C7.44055 3.16737 7.16651 4.11662 7.23776 5.07203C7.30901 6.02744 7.72081 6.92554 8.39826 7.60299C9.07571 8.28044 9.97381 8.69224 10.9292 8.76349C11.8846 8.83473 12.8339 8.5607 13.6043 7.99122C13.8156 7.83502 14.099 7.81753 14.3279 7.94655C14.5568 8.07556 14.6886 8.32702 14.6644 8.58868C14.5479 9.84957 14.0747 11.0512 13.3002 12.053C12.5256 13.0547 11.4818 13.8152 10.2909 14.2454C9.09992 14.6756 7.81108 14.7577 6.57516 14.4821C5.33925 14.2065 4.20738 13.5846 3.312 12.6892C2.41661 11.7939 1.79475 10.662 1.51917 9.42608C1.24359 8.19017 1.32569 6.90133 1.75588 5.71038C2.18606 4.51942 2.94652 3.47561 3.94828 2.70109C4.95005 1.92656 6.15168 1.45335 7.41257 1.33682C7.67423 1.31264 7.92568 1.44442 8.0547 1.67334ZM6.21151 2.96004C5.6931 3.1476 5.20432 3.41535 4.76384 3.75591C3.96242 4.37553 3.35405 5.21058 3.00991 6.16334C2.66576 7.11611 2.60008 8.14718 2.82054 9.13591C3.04101 10.1246 3.5385 11.0301 4.25481 11.7464C4.97111 12.4627 5.87661 12.9602 6.86534 13.1807C7.85407 13.4012 8.88514 13.3355 9.8379 12.9913C10.7907 12.6472 11.6257 12.0388 12.2453 11.2374C12.5859 10.7969 12.8536 10.3081 13.0412 9.78974C12.3391 10.0437 11.586 10.1495 10.8301 10.0931C9.55619 9.99813 8.35872 9.44907 7.45545 8.5458C6.55218 7.64253 6.00312 6.44506 5.90812 5.17118C5.85174 4.4152 5.9575 3.66212 6.21151 2.96004Z'
                  ></path>
                </svg>
                Dark
              </span>
            </label>
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
              disabled={loading}
              className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Password'}
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

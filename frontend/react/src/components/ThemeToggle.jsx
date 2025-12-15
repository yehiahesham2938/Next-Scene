import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <i className="fa-solid fa-moon text-gray-800 dark:text-gray-200"></i>
      ) : (
        <i className="fa-solid fa-sun text-yellow-500"></i>
      )}
    </button>
  );
};

export default ThemeToggle;

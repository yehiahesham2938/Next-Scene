export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return typeof rating === 'number' ? rating.toFixed(1) : rating;
};

export const formatYear = (year) => {
  if (!year) return 'N/A';
  return year;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getGenreColor = (genre) => {
  const colors = {
    Action: 'bg-red-500',
    Comedy: 'bg-yellow-500',
    Drama: 'bg-blue-500',
    Horror: 'bg-purple-500',
    Romance: 'bg-pink-500',
    'Sci-Fi': 'bg-green-500',
    Thriller: 'bg-gray-700',
    Fantasy: 'bg-indigo-500',
    Animation: 'bg-orange-500',
    Documentary: 'bg-teal-500',
  };
  return colors[genre] || 'bg-gray-500';
};

export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

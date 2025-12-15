export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const setUser = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return getUser() !== null;
};

export const isAdmin = () => {
  const user = getUser();
  return user && user.role === 'admin';
};

export const getUserId = () => {
  const user = getUser();
  return user ? user._id || user.id : null;
};

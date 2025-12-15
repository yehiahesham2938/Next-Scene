import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.signup(email.trim(), password, username.trim());

      if (data._id || data.id) {
        login(data);
        navigate('/');
      } else {
        setError(data.message || 'Failed to create account');
      }
    } catch (err) {
      console.error(err);
      setError('Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 max-w-[320px] w-full p-8 pt-10 sm:border sm:border-gray-300 dark:border-gray-700 sm:rounded-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 dark:bg-gray-700 rounded-xl p-4">
            <i className="fa-solid fa-film text-white text-3xl"></i>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Create Account</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
          Join Next-Scene today
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded py-2 px-3">
              {error}
            </div>
          )}

          <Input
            label="Username"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
            required
          />

          <Input
            label="Email address"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">
          Already have an account?{' '}
          <Link to="/signin" className="text-gray-900 dark:text-white font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

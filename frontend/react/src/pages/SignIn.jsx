import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, status } = await authAPI.signin(email.trim(), password);

      if (status === 200) {
        login(data);
        navigate('/');
      } else if (status === 401) {
        setError(data.message || 'User does not have an account');
      } else {
        setError(data.message || 'Failed to sign in');
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Welcome Back</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
          Sign in to your Next-Scene account
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded py-2 px-3">
              {error}
            </div>
          )}

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

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-gray-900 dark:text-white font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setToken, setUser } from '../redux/userSlice'; // Adjust path based on your project
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const user = useSelector((state) => state.user); // Get user state from Redux
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('Updated user state:', user); // Log the updated user state
  }, [user]);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    const token = localStorage.getItem('token');
    
    if (userInfo && token) {
      dispatch(setUser(JSON.parse(userInfo)));
      dispatch(setToken({ token }));
      navigate('/');  // If already logged in, navigate to dashboard
    }
  }, [dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/auth/login',
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Login successful!', { position: 'top-right', autoClose: 500 });

        // Save to localStorage
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);

        // Update Redux store
        dispatch(setUser(response.data.user));
        dispatch(setToken(response.data.token));

        console.log('redux user', user);
        console.log('redux token', token);

        setTimeout(() => navigate('/'), 1000); // Navigate to dashboard
      } else {
        toast.error(response.data.error || 'Login failed', { position: 'top-right', autoClose: 3000 });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || 'Server error. Please try again later.',
        { position: 'top-right', autoClose: 3000 }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) return <Spinner />;

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="col-md-6 shadow p-4 rounded bg-light">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group mb-3">
              <label htmlFor="username">Email or Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={submitting}
                autoComplete="username"  // Added autocomplete attribute for username
              />
            </div>

            <div className="form-group mb-4 position-relative">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
                autoComplete="current-password"  // Added autocomplete attribute for password
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#555',
                }}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={submitting || !username || !password}
            >
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center">
            <p>New User?</p>
            <Link to="/register" className="btn btn-outline-secondary">
              Register
            </Link>
          </div>
        </div>

        <ToastContainer 
          position="bottom-center"
          autoClose={3000}
          toastClassName="rounded-toasts"
        />
      </div>
    </>
  );
};

export default Login;

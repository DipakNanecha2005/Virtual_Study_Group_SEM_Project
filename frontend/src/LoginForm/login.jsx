import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/auth/login',
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Login successful!', { position: 'top-right', autoClose: 2000 });
        setTimeout(() => navigate('/'), 2500);
      } else {
        toast.error(response.data.error || 'Login failed', { position: 'top-right', autoClose: 3000 });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || 'Server error. Please try again later.',
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
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={submitting}
            >
              {submitting ? <Spinner small /> : 'Login'}
            </button>
          </form>
          <div className="text-center">
            <p>New User?
            <Link to="/register" className="btn btn-outline-secondary">Register</Link>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;

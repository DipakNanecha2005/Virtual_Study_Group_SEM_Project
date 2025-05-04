import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const { userInfo, token } = useSelector((state) => state.user); // Get user state from Redux
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    gender: ''
  });

  const navigate = useNavigate();


  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const validateFullName = (name) => /^[A-Za-z\s-]{3,50}$/.test(name);
  const validateEmail = (email) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);

  function validateUsername(username) {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*(?:[._-]?[a-zA-Z0-9]+)*$/;
    return regex.test(username) && username.length >= 3 && username.length <= 20;
  }

  // Optional: check username availability (backend must support this route)
  useEffect(() => {
    const checkUsername = async () => {
      if (!validateUsername(username)) return;
      setCheckingUsername(true);
      try {
        const res = await axios.post('http://localhost:5000/auth/check-username', { username });
        setErrors((prev) => ({
          ...prev,
          username: res.data.available ? '' : 'Username is already taken.'
        }));
      } catch (err) {
        console.log('Username check failed:', err.message);
      }
      setCheckingUsername(false);
    };

    const delayDebounce = setTimeout(checkUsername, 600);
    return () => clearTimeout(delayDebounce);
  }, [username]);

  const handleFieldChange = (field, value) => {
    // Set field value
    if (field === 'fullName') setFullName(value);
    if (field === 'username') setUsername(value.trimStart());
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'gender') setGender(value);

    // Validate and update errors
    let newErrors = { ...errors };

    switch (field) {
      case 'fullName':
        newErrors.fullName = validateFullName(value) ? '' : 'Full name must be 3–50 letters.';
        break;
      case 'username':
        newErrors.username = value && !validateUsername(value)
          ? 'Use 3–20 letters/numbers; start with a letter. Use _, ., - in between only.'
          : '';
        break;
      case 'email':
        newErrors.email = validateEmail(value) ? '' : 'Please enter a valid email address.';
        break;
      case 'password':
        newErrors.password = validatePassword(value)
          ? ''
          : '8–20 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.';
        break;
      case 'gender':
        newErrors.gender = value ? '' : 'Please select your gender.';
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim() || !gender) {
      toast.error('Please fill in all fields correctly.', { position: 'top-right' });
      return;
    }

    if (Object.values(errors).some((msg) => msg)) {
      toast.error('Please fix the errors before submitting.', { position: 'top-right' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/auth/signup',
        {
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
          gender,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.msg || 'Signup successful!', { position: 'top-right', autoClose: 500 });

        setFullName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setGender('');
        dispatch(setUser(response.data.user));
        setTimeout(() => navigate('/'), 500);
      } else {
        toast.error(response.data.error || 'Signup failed.', { position: 'top-right' });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Server error. Please try again later.', {
        position: 'top-right',
      });
    }

    setLoading(false);
  };

  if (initialLoading) return <Spinner />;

  const hasErrors = Object.values(errors).some((msg) => msg);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="col-md-6 bg-light p-4 shadow rounded">
        <h2 className="mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              value={fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              required
            />
            {errors.fullName && <div className="text-danger">{errors.fullName}</div>}
          </div>

          <div className="form-group mb-1">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => handleFieldChange('username', e.target.value)}
              required
            />
            <small className="text-muted">3–20 chars. Letters, numbers, _ . - allowed (no spaces).</small>
            {errors.username && <div className="text-danger">{errors.username}</div>}
            {checkingUsername && <div className="text-secondary">Checking availability...</div>}
          </div>

          <div className="form-group mb-3 mt-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              required
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="gender">Gender</label>
            <select
              className="form-control"
              id="gender"
              value={gender}
              onChange={(e) => handleFieldChange('gender', e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <div className="text-danger">{errors.gender}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading || hasErrors || checkingUsername}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-3">
          <p>Already have an account?</p>
          <Link to="/login" className="btn btn-outline-secondary">
            Login
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;

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
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.user);

    useEffect(() => {
        const timer = setTimeout(() => setInitialLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);
    
    // Redirect if already logged in
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const validateFullName = (name) => {
        const regex = /^[A-Za-z\s-]{3,50}$/;
        return regex.test(name);
    };

    const validateEmail = (email) => {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return regex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!fullName.trim() || !username.trim() || !password.trim() || !gender) {
            toast.error('Please fill in all fields correctly.', { position: 'top-right' });
            return;
        }

        if (!validateFullName(fullName)) {
            toast.error('Full name must be between 3 and 50 characters, and only contain letters and spaces.', { position: 'top-right' });
            return;
        }

        if (!validateEmail(username)) {
            toast.error('Please enter a valid email address.', { position: 'top-right' });
            return;
        }

        if (!validatePassword(password)) {
            toast.error('Password must be 8-20 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.', { position: 'top-right' });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:5000/auth/signup',
                {
                    fullName: fullName.trim(),
                    username: username.trim(),
                    password: password.trim(),
                    gender,
                },
                {
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success(response.data.msg, { position: 'top-right', autoClose: 500 });
                setFullName('');
                setUsername('');
                setPassword('');
                setGender('');
                setTimeout(() => navigate('/login'), 1000);
            } else {
                toast.error(response.data.error || 'Something went wrong', { position: 'top-right' });
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error(
                error.response?.data?.error || 'Network or Server issue',
                { position: 'top-right' }
            );
        }

        setLoading(false);
    };

    // Show spinner during initial loading
    if (initialLoading) return <Spinner />;

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="col-md-6 bg-light p-4 shadow rounded">
                <h2 className="mb-4 text-center">Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Username (Email)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="gender">Gender</label>
                        <select
                            className="form-control"
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Signing up...' : 'Signup'}
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p>Already have an account?</p>
                    <Link to="/login" className="btn btn-outline-secondary">Login</Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup;
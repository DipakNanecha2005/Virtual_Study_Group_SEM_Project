import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);

    const user = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    // Show spinner for the first 1 sec
    useEffect(() => {
        const timer = setTimeout(() => setInitialLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Fetch user data
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axios.get('http://localhost:5000/auth/user-info', {
                    withCredentials: true,
                });
                setUserInfo(res.data);
            } catch (err) {
                console.error(err);
                setUserInfo(null);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
        
    }, []);

    

    if (initialLoading || loading) return <Spinner />;

    return (
        <div>
            <Navbar />

            <div className="container mt-5">
                <h2 className="mb-4">
                    {userInfo ? `Welcome ${userInfo.fullName} to Your Study Dashboard` : "Loading your dashboard..."}
                </h2>

                {userInfo && (
                    <div className="card mb-4 shadow-lg border-0 rounded-4 p-4" style={{ backgroundColor: "#f8f9fa" }}>
                        <div className="d-flex align-items-center">
                            <img
                                src={userInfo.avatar}
                                alt="avatar"
                                className="rounded-circle me-4"
                                style={{ width: 80, height: 80, border: '2px solid #007bff' }}
                            />
                            <div>
                                <h4 className="mb-1">{userInfo.fullName}</h4>
                                <p className="mb-0"><strong>Username:</strong> {userInfo.username}</p>
                                <p className="mb-0"><strong>Gender:</strong> {userInfo.gender}</p>
                            </div>
                            <div className="ms-auto">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => navigate('/edit-profile')}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">My Groups</h5>
                                <p className="card-text">View or manage your study groups.</p>
                                <button className="btn btn-primary" onClick={() => navigate('/groups')}>View Groups</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Chats</h5>
                                <p className="card-text">Check DMs.</p>
                                <button className="btn btn-success" onClick={() => navigate('/chat')}>Go to Messages</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Files & Resources</h5>
                                <p className="card-text">Access or upload shared files.</p>
                                <button className="btn btn-warning" onClick={() => navigate('/resources')}>Open Files</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ToastContainer />
 
            <footer className="bg-dark text-white text-center mt-5 py-3">
                <p className="mb-0">© {new Date().getFullYear()} Virtual Study Group. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;

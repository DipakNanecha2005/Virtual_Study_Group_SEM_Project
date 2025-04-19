import React, { useState } from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5000/auth/user-info', {
                params: { username: searchTerm },
                withCredentials: true
            });
            
            setUserInfo(response.data);
            setErrorMessage('');
        } catch(err){
            setUserInfo(null);
            setErrorMessage('User not found or an error occurred.');
        }
    };

    return (
        <div>
            <Navbar />

            {/* Main Dashboard Content */}
            <div className="container mt-5">
                <h2 className="mb-4">Welcome to Your Study Dashboard</h2>

                {/* Search Section */}
                <div className="mb-4">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search User by Username"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    {userInfo && (
                        <div className="mt-3">
                            <h5>User Info</h5>
                            <p><strong>Full Name:</strong> {userInfo.fullName}</p>
                            <p><strong>Username:</strong> {userInfo.username}</p>
                            <p><strong>Gender:</strong> {userInfo.gender}</p>
                            <img src={userInfo.avatar} alt="avatar" style={{ width: 50, height: 50 }} />
                        </div>
                    )}
                </div>

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
                                <h5 className="card-title">Messages</h5>
                                <p className="card-text">Check group chats and DMs.</p>
                                <button className="btn btn-success" onClick={() => navigate('/messages')}>Go to Messages</button>
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

            {/* Footer */}
            <footer className="bg-dark text-white text-center mt-5 py-3">
                <p className="mb-0">© {new Date().getFullYear()} Virtual Study Group. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;

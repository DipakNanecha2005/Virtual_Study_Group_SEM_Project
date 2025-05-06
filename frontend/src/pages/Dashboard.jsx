import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Spinner from '../Spinner/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import  './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo, token } = useSelector((state) => state.user);

  useEffect(() => {
    // Redirect to login if no valid token is present
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Show a loading spinner while redirecting
  if (!token) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">
          {userInfo && userInfo._id
            ? `Welcome ${userInfo.fullName} to Your Study Dashboard`
            : 'Loading your dashboard...'}
        </h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">My Groups</h5>
                <p className="card-text">View or manage your study groups.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/groups')}
                >
                  View Groups
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Chats</h5>
                <p className="card-text">Check DMs.</p>
                <button
                  className="btn btn-success"
                  onClick={() => navigate('/chat')}
                >
                  Go to Messages
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Files & Resources</h5>
                <p className="card-text">Access or upload shared files.</p>
                <button
                  className="btn btn-warning"
                  onClick={() => navigate('/resources')}
                >
                  Open Files
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">© {new Date().getFullYear()} Virtual Study Group. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Dashboard;

import React, { useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { resetChatState } from '../redux/chatSlice';
import { resetUIstate } from '../redux/uiSlice';

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const Info = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/user-info', {
        params: { userId: userInfo._id },
        withCredentials: true,
      });
      console.log(response.data); // Handle this data as needed
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Failed to fetch user info.", { position: 'top-right', autoClose: 3000 });
    }
  };

  // Run Info only once when the component mounts
  useEffect(() => {
    if (userInfo) {
      Info();
    }
  }, [userInfo]);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success === true) {
        toast.success('Logged out successfully!', {
          position: 'top-right',
          autoClose: 500,
        });
        dispatch(logout());
        dispatch(resetChatState());
        dispatch(resetUIstate());
        setTimeout(() => navigate('/login'), 1000);
      } else {
        toast.error('Logout failed. Try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error. Please try later.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Virtual Study Group</a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/">Dashboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/groups">Groups</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/chat">Messages</a>
              </li>
            </ul>

            {userInfo && (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item text-white d-flex align-items-center">
                  <span>{userInfo.fullName}</span>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-dark border-0"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={userInfo.avatar || '/default-avatar.png'}
                      alt="User Avatar"
                      className="rounded-circle"
                      width="30"
                      height="30"
                      style={{ marginRight: '8px' }}
                    />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li>
                      <button
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#profileModal"
                      >
                        Profile
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <div
        className="modal fade"
        id="profileModal"
        tabIndex="-1"
        aria-labelledby="profileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="profileModalLabel">User Profile</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              <img
                src={userInfo.avatar || '/default-avatar.png'}
                alt="User Avatar"
                className="rounded-circle mb-3"
                width="100"
                height="100"
              />
              <h5>{userInfo.fullName}</h5>
              <p className="mb-1"><strong>Username:</strong> {userInfo.username}</p>
              <p className="mb-1"><strong>Email:</strong> {userInfo.email}</p>
              <p className="mb-1"><strong>Gender:</strong> {userInfo.gender || 'Not specified'}</p>
              <p className="mb-1">
                <strong>Profile Complete:</strong> {userInfo.isProfileComplete ? 'Yes' : 'No'}
              </p>
              <p className="mb-0">
                <strong>Member Since:</strong> {new Date(userInfo.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

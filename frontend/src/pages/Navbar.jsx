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

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success === true) {
        toast.success("Logged out successfully!", {
          position: 'top-right',
          autoClose: 500,
        });
        dispatch(logout());
        dispatch(resetChatState());
        dispatch(resetUIstate());
        setTimeout(() => navigate('/login'), 1000);
      } else {
        toast.error("Logout failed. Try again.", {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try later.", {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {}, []);

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
              <li className="nav-item">
                <a className="nav-link" href="/resources">Resources</a>
              </li>
                <li>
                    {userInfo.fullName}
                </li>
            </ul>

            {userInfo && (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-dark border-0"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUserCircle size={22} />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li><a className="dropdown-item" href="/profile">Profile</a></li>
                    <li><a className="dropdown-item" href="/settings">Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

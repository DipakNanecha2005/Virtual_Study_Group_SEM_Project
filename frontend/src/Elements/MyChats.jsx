import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { setSelectedChat } from '../redux/chatSlice';

const MyChats = ({ fetchAgain }) => {
  const { userInfo } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  
  const chats = useSelector((state) => state.chat.chats);
  console.log('chats in mychats page',chats);


  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Chats</h3>
        <button className="btn btn-primary">+ New Group Chat</button>
      </div>

      {loading ? (
        <div className="text-center my-3">
          <div className="spinner-border" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="list-group">
{chats.length > 0 ? (
  chats.map((user, index) => (
    <div
      key={index}
      className="list-group-item list-group-item-action"
      onClick={() => dispatch(setSelectedChat(user))}
      style={{ cursor: 'pointer' }}
    >
      <h5 className="mb-1">{user.username|| user || 'Unnamed User'}</h5>

      <small>{user.email || 'No email'}</small>

    </div>
  ))
) : (
  <p>No chats found</p>
)}

        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MyChats;

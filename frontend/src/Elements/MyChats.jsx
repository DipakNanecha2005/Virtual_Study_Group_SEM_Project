import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const MyChats = ({ fetchAgain }) => {
  const { userInfo } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      if (!userInfo || !userInfo._id) return;
      setLoading(true);
      try {
        // ⬇️ GET request to fetch user chats
        const response = await axios.get(`http://localhost:5000/chats/${userInfo._id}`, {
          withCredentials: true
        });
        setChats(response.data); // ✅ Assume API returns chat array
      } catch (error) {
        setError('Error fetching chats');
        toast.error('Error fetching chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [fetchAgain, userInfo]);

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
            chats.map((chat) => (
              <div key={chat._id} className="list-group-item list-group-item-action">
                <h5 className="mb-1">{chat.name || 'Unnamed Chat'}</h5>
                <small>{chat.members?.length || 0} members</small>
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

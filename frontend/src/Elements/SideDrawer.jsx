import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import UserListItem from './UserAvatar/UserListItem';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setSelectedChat, chats, setChats } = ChatState();

  // Function to search users
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/contact/search',
        { searchString: query },
        { withCredentials: true }
      );
      setSearchResult(res.data.contacts);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Error occurred while searching users', {
        position: "top-left",
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  // Input change handler
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  // Function to access or create a chat
  const accessChat = async (otherUser) => {
    try {
      toast.success(`Chat opened with ${otherUser.fullName}!`, {
        position: "top-right",
        autoClose: 1000,
      });

      setLoading(true);

      const { data } = await axios.post(
        'http://localhost:5000/chat/',
        {
          isGroup: false,
          self: user._id,
          otherUser: otherUser._id
        },
        { withCredentials: true }
      );

      const newChat = data.chat;
      if (Array.isArray(chats) && !chats.find((c) => c._id === newChat._id)) {
        setChats([newChat, ...chats]);
      } else if (!Array.isArray(chats)) {
        setChats([newChat]);
      }
      

      setSelectedChat(newChat);
    } catch (error) {
      console.error('Error accessing chat:', error);
      toast.error(`Error fetching the chat: ${error.message}`, {
        position: "top-right",
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          {/* Search Button */}
          <div style={{ width: "200px" }}>
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center w-100"
              style={{ gap: "10px" }}
              data-bs-toggle="offcanvas"
              data-bs-target="#drawerExample"
            >
              <FaSearch />
              <span>Search users...</span>
            </button>
          </div>

          {/* Title */}
          <div className="flex-grow-1 text-center">
            <h3 className="mb-0">Chat with Someone</h3>
          </div>

          {/* Icons */}
          <div className="d-flex align-items-center" style={{ gap: "20px" }}>
            <FaBell size={24} style={{ cursor: 'pointer' }} />
            <FaUserCircle size={40} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      {/* Offcanvas Drawer */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="drawerExample"
        aria-labelledby="drawerExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 id="drawerExampleLabel">Search Users</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          {/* Search input */}
          <div className="d-flex pb-2">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search by subject, topic, email, username"
              value={search}
              onChange={handleSearchChange}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSearch(search)}
            >
              Go
            </button>
          </div>

          {/* Search Results */}
          {loading ? (
            <Spinner />
          ) : (
            <>
              {searchResult?.length > 0 ? (
                searchResult.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => accessChat(u)}
                  />
                ))
              ) : (
                search.trim() && <p>No users found for "{search}".</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer />
    </>
  );
};

export default SideDrawer;

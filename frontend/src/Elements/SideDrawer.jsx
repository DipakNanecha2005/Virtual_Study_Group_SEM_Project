import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import UserListItem from './UserAvatar/UserListItem';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat } from '../redux/chatSlice';



const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const userInfo = useSelector((state) => state.user.userInfo);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const dispatch = useDispatch();
  const closeRef = useRef(); // For auto-close

  const handleSearchChange = (value) => {
    setSearch(value);
    if(value.length===0){
      setSearchResult([]);
      return;
    }
    handleSearch(value);
  };

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
      console.error('Search error:', error);
      toast.error('Failed to search users', {
        position: 'top-left',
        autoClose: 2000,
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (user) => {
    try {

      const res = await axios.post('http://localhost:5000/chat/',
        {
          isGroup: false,
          self: userInfo._id,
          otherUser: user._id 
        },
        { withCredentials: true }
      );
  
      const newChat = {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        isProfileComplete: user.isProfileComplete,
        lastMessage: null,
        createdAt: res.data.chat.createdAt,
        updatedAt: res.data.chat.updatedAt,
        chat_id: res.data.chat._id,
      };
  
      dispatch(setSelectedChat(newChat));
      //below is res when user click on result of contact page 
      // {
      //   "_id": "68165d2a5cb485cbf64d79b7",
      //   "isGroup": false,
      //   "members": [
      //     "6804c0e9535ddefc4f61964e",
      //     "680fad56dc24c9f7d9709aae"
      //   ],
      //   "createdAt": "2025-05-03T18:15:06.239Z",
      //   "updatedAt": "2025-05-03T18:15:06.239Z",
      //   "__v": 0
      // }
      
      closeRef.current?.click(); // Auto-close drawer
    } catch (error) {
      console.error("Accessing chat failed:", error);
      toast.error("Could not access chat", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };


useEffect(() => {
  if (selectedChat) {
    console.log("Chat updated in state:", selectedChat);
  }
}, [selectedChat]);

  

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
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            ref={closeRef}
          />
        </div>
        <div className="offcanvas-body">
          {/* Search input */}
          <div className="d-flex pb-2">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search by name, username, or email"
              value={search}
              onChange={ (e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Search Results */}
          {loading ? (
            <Spinner />
          ) : (
            <>
              {searchResult.length === 0 ? (
                <p className="text-lg text-center mt-4">Explore users to start a conversation</p>
              ) : (
                searchResult.map((userItem) => (
                  <UserListItem
                    key={userItem._id}
                    user={userItem}
                    handleFunction={() => createChat(userItem)}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default SideDrawer;

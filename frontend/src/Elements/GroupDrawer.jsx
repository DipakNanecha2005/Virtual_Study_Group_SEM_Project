// GroupDrawer.js
import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaBell, FaUsers } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import GroupListItem from './GroupAvatar/GroupListItem';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat } from '../redux/chatSlice';

const GroupDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const userInfo = useSelector((state) => state.user.userInfo);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const dispatch = useDispatch();
  const closeRef = useRef(); // For auto-close

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value.length === 0) {
      setSearchResult([]);
    } else {
      handleSearch(value);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/group/search',
        { searchString: query },
        { withCredentials: true }
      );
      setSearchResult(res.data.groups);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search groups', {
        position: 'top-left',
        autoClose: 2000,
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroupChat = async (group) => {
    try {
      const res = await axios.post('http://localhost:5000/chat/group',
        {
          isGroup: true,
          self: userInfo._id,
          groupId: group._id,
        },
        { withCredentials: true }
      );

      const newChat = {
        _id: group._id,
        name: group.name,
        lastMessage: null,
        createdAt: res.data.chat.createdAt,
        updatedAt: res.data.chat.updatedAt,
        chat_id: res.data.chat._id,
      };

      dispatch(setSelectedChat(newChat));
      closeRef.current?.click(); // Auto-close drawer
    } catch (error) {
      console.error("Accessing group chat failed:", error);
      toast.error("Could not access group chat", {
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
        <div className="d-flex justify-content-between align-items-center">
          <h4>Group Search</h4>
          <button ref={closeRef} className="btn btn-light">
            <FaBell />
          </button>
        </div>
        <div className="d-flex p-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search for a group"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <FaSearch className="ms-2" />
        </div>
        <div className="mt-3">
          {loading ? (
            <div className="text-center">
              <Spinner />
            </div>
          ) : (
            <ul className="list-group">
              {searchResult.length > 0 ? (
                searchResult.map((group) => (
                  <li
                    key={group._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => createGroupChat(group)}
                  >
                    <GroupListItem group={group} />
                  </li>
                ))
              ) : (
                <p className="text-center p-2">No results found</p>
              )}
            </ul>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default GroupDrawer;

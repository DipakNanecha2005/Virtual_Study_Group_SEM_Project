import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserListItem from '../Elements/UserAvatar/UserListItem'; // Uncommented this import
import { setSelectedChat } from '../redux/chatSlice';
import { FaSearch } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import axios from 'axios';

const GroupList = ({ isMobile }) => {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chat.chats);
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChatSelect = (chat) => {
    dispatch(setSelectedChat(chat));
    console.log("Selected chat:", chat);
  };

  // Filter group chats
  const groupChats = Array.isArray(chats)
    ? chats.filter(chat => chat.isGroupChat)
    : [];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResult([]);
    } else {
      handleSearch(e.target.value);
    }
  };

  // Search function
  const handleSearch = async (query) => {
    if (!query.trim()) return;

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) {
      setSearchResult([]);
    }
  }, [search]);

  return (
    <div className="card h-100 d-flex flex-column">
      <div className="card-header">
        <b>Group Chats</b>
      </div>

      <div className="flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Search Bar */}
        <div className="d-flex p-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by group name"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Search Results or Default Group List */}
        {loading ? (
          <div className="text-center">
            <Spinner />
          </div>
        ) : (
          <>
            {search ? (
              <ul className="list-group list-group-flush">
                {searchResult.length > 0 ? (
                  searchResult.map((group) => (
                    <li
                      key={group._id}
                      className={`list-group-item ${selectedChat?.chat_id === group._id ? 'active' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleChatSelect(group)}
                    >
                      <UserListItem user={group} />
                    </li>
                  ))
                ) : (
                  <p className="p-2 text-center">No results found</p>
                )}
              </ul>
            ) : (
              <ul className="list-group list-group-flush">
                {/* Group Chats Section */}
                {groupChats.length > 0 ? (
                  groupChats.map((group) => (
                    <li
                      key={group.chat_id}
                      className={`list-group-item ${selectedChat?.chat_id === group.chat_id ? 'active' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleChatSelect(group)}
                    >
                      <UserListItem user={group} />
                    </li>
                  ))
                ) : (
                  <p className="p-2">No group chats available</p>
                )}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupList;
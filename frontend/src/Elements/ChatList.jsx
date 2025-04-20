import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';
import axios from 'axios';

const ChatList = ({ onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = debounce(async (query) => {
    if (!query.trim()) {
      setContacts([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/contact/search',
        { searchString: query },
        { withCredentials: true }
      );
      setContacts(res.data.contacts);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    searchUsers(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-3 border-end bg-white" style={{ width: '280px', height: '100vh', overflowY: 'auto' }}>
      <h5 className="mb-4 text-primary">Chats</h5>

      {/* Search Bar */}
      <div className="input-group mb-4">
        <span className="input-group-text bg-white">
          <Search size={18} />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="d-flex align-items-center text-muted mb-3">
          <div className="spinner-border spinner-border-sm me-2" role="status" />
          <span>Searching...</span>
        </div>
      )}

      {/* No Results */}
      {!loading && contacts.length === 0 && searchTerm && (
        <p className="text-muted text-center">No users found.</p>
      )}

      {/* Contact List */}
      <div className="list-group">
        {contacts.map((contact) => (
          <button
            key={contact._id}
            type="button"
            className="list-group-item list-group-item-action d-flex align-items-center gap-3"
            onClick={() => onSelectChat(contact)}
          >
            <img
              src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.fullName}`}
              alt="avatar"
              className="rounded-circle"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
            <div className="text-start">
              <div className="fw-bold">{contact.fullName}</div>
              <small className="text-muted">@{contact.username}</small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatList;

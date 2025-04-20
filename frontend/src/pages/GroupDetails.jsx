import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';

const dummyUsers = [
  { id: 1, name: 'Alice', lastMessage: 'Hey, how’s it going?' },
  { id: 2, name: 'Bob', lastMessage: 'Did you finish the assignment?' },
  { id: 3, name: 'Charlie', lastMessage: 'Let’s meet at 5 PM.' },
  { id: 4, name: 'David', lastMessage: 'Check your mail!' },
  { id: 5, name: 'Eve', lastMessage: 'Thanks for the notes!' },
];

const dummyGroups = [
  { id: 101, name: 'DSA Warriors', members: ['Alice', 'Bob'] },
  { id: 102, name: 'Final Year Project', members: ['Charlie', 'David', 'Eve'] },
];

const GroupDetails = ({ onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleUserSelection = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = () => {
    console.log('Group Name:', groupName);
    console.log('Selected Members:', selectedMembers);
    setShowModal(false);
    setGroupName('');
    setSelectedMembers([]);
  };

  const filteredUsers = dummyUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 border-end" style={{ width: '280px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{activeTab === 'chats' ? 'Chats' : 'Groups'}</h5>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> New Group
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-3">
        <button
          className={`btn btn-sm me-2 ${activeTab === 'chats' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'groups' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </button>
      </div>

      {/* Search Bar */}
      {activeTab === 'chats' && (
        <div className="input-group mb-3">
          <span className="input-group-text bg-white">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Chat Users List */}
      {activeTab === 'chats' &&
        filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectChat(user)}
            className="p-2 border rounded mb-2 bg-light"
            style={{ cursor: 'pointer' }}
          >
            <strong>{user.name}</strong>
            <p className="mb-0 text-muted" style={{ fontSize: '0.9em' }}>
              {user.lastMessage}
            </p>
          </div>
        ))}

      {/* Groups List */}
      {activeTab === 'groups' &&
        dummyGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => onSelectChat(group)}
            className="p-2 border rounded mb-2 bg-light"
            style={{ cursor: 'pointer' }}
          >
            <strong>{group.name}</strong>
            <p className="mb-0 text-muted" style={{ fontSize: '0.9em' }}>
              Members: {group.members.join(', ')}
            </p>
          </div>
        ))}

      {/* Modal for Creating Group */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Group Name</label>
            <input
              type="text"
              className="form-control"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Select Members</label>
            {dummyUsers.map((user) => (
              <div key={user.id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`user-${user.id}`}
                  checked={selectedMembers.includes(user.id)}
                  onChange={() => toggleUserSelection(user.id)}
                />
                <label className="form-check-label" htmlFor={`user-${user.id}`}>
                  {user.name}
                </label>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupDetails;

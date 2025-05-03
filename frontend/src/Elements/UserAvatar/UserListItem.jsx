import React from 'react';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="d-flex align-items-center p-2 mb-2 rounded"
      style={{
        backgroundColor: '#f0f0f0',
        cursor: 'pointer',
      }}
    >
      <img
        src={user.avatar || 'https://via.placeholder.com/40'}
        alt={user.fullName}
        className="rounded-circle me-3"
        width="40"
        height="40"
      />
      <div>
        <p className="mb-1 fw-bold">{user.fullName}</p>
        <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
          <b>username:</b> {user.username}
          <b>{}</b>
        </p>
      </div>
    </div>
  );
};

export default UserListItem;

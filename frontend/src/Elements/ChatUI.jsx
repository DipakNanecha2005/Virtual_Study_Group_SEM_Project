import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';

const ChatUI = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="d-flex border rounded shadow" style={{ height: '500px' }}>
      <ChatList onSelectChat={setSelectedUser} />
      <div className="flex-grow-1">
        <ChatBox selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default ChatUI;

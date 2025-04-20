import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([
    { text: 'Hi there!', fromMe: false },
    { text: 'Hey! What’s up?', fromMe: true },
  ]);

  const handleSend = (text) => {
    setMessages([...messages, { text, fromMe: true }]);
  };

  if (!selectedUser) {
    return <div className="p-4">Select a user to start chatting</div>;
  }

  return (
    <div className="d-flex flex-column justify-content-between h-100 p-3">
      <div className="overflow-auto mb-3" style={{ flexGrow: 1 }}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg.text} isMine={msg.fromMe} />
        ))}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatBox;

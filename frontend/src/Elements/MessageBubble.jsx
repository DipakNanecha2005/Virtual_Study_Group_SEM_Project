import React from 'react';

const MessageBubble = ({ message, isMine }) => {
  return (
    <div
      className={`p-2 mb-2 rounded ${isMine ? 'bg-primary text-white ms-auto' : 'bg-secondary text-white me-auto'}`}
      style={{ maxWidth: '60%' }}
    >
      {message}
    </div>
  );
};

export default MessageBubble;

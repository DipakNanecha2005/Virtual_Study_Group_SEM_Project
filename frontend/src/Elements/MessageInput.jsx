import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() === '') return;
    onSend(text);
    setText('');
  };

  return (
    <div className="d-flex p-2 border-top">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button className="btn btn-primary" onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;

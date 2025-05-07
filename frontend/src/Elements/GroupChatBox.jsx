import React, { useState, useEffect, useRef } from 'react';

const GroupChatBox = ({ userInfo, loading, messages, newMsg, handleSend, handleTyping, selectedGroup }) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderMessages = () => {
    if (loading) {
      return <p>Loading messages...</p>;
    } else if (messages.length > 0) {
      return messages.map((msg) => {
        const isMe = msg.sender === userInfo._id || msg.sender?._id === userInfo._id;
        return (
          <div
            key={msg._id}
            className={`d-flex mb-2 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`p-3 rounded-3 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-light text-dark'}`}
              style={{ maxWidth: '70%', wordBreak: 'break-word' }}
            >
              {msg.messageType === 'file' ? (
                <a href={msg.fileUrl} target="_blank" rel="noreferrer">
                  📎 View File
                </a>
              ) : (
                <div>{msg.content}</div>
              )}
              <div className="text-end mt-1" style={{ fontSize: '0.75rem' }}>
                <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return <p>No messages yet</p>;
    }
  };

  return (
    <div className="card h-100 d-flex flex-column">
      {/* Chat Header */}
      <div className="card-header">
        <b>Group Chat: {selectedGroup ? selectedGroup.name : 'No Group Selected'}</b>
      </div>

      {/* Message Area */}
      <div className="flex-grow-1 overflow-auto p-3" style={{ background: '#f8f9fa' }}>
        {renderMessages()}
        {/* Scroll Target */}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="card-footer">
        <form
          className="d-flex"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={newMsg}
            onChange={handleTyping}
          />
          <button type="submit" className="btn btn-primary ms-2">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChatBox;
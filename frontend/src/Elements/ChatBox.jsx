import React, { useEffect, useRef } from 'react';

const ChatBox = ({
  messages,
  userInfo,
  selectedChat,
  loading,
  handleSend,
  newMsg,
  handleTyping,
}) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="card h-100 d-flex flex-column">

      {/* Chat Header */}
      <div className="card-header">
        <b>Chat with {selectedChat ? selectedChat.fullName : 'No Chat Selected'}</b>
      </div>

      {/* Message Area */}
      <div className="flex-grow-1 overflow-auto p-3" style={{ background: '#f8f9fa' }}>
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
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
          })
        ) : (
          <p>No messages yet</p>
        )}

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

export default ChatBox;

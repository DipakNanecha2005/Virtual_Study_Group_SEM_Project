import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNewMsg } from '../redux/uiSlice';
import { handleUserTyping, sendMessage } from '../redux/messageThunks';
import { setSelectedChat } from '../redux/chatSlice';

const ChatBox = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const { messages, loading, newMsg,isTyping } = useSelector((state) => state.ui);
  
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    dispatch(sendMessage({
      content: newMsg,
      userId: userInfo._id,
      chatId: selectedChat.chat_id,
    }));
  };

  const handleTyping = (e) => {
    dispatch(handleUserTyping({
      value : e.target.value,
      userId: userInfo._id,
      chatId: selectedChat._id
    }))
  };

  const handleBackToContacts = () => {
    dispatch(setSelectedChat(null));
  };

  return (
    <div className="card h-100 d-flex flex-column">
      {/* Chat Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <b>Chat with {selectedChat ? selectedChat.fullName : 'No Chat Selected'}</b>
        <button 
          className="btn btn-sm btn-outline-secondary d-md-none"
          onClick={handleBackToContacts}
        >
          Back
        </button>
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

        {/* Typing Indicator */}
        {isTyping && (
          <div className="typing-indicator mt-2">
            <p className="text-muted"><em>Someone is typing...</em></p>
          </div>
        )}

        {/* Scroll Target */}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="card-footer">
        <form
          className="d-flex"
          onSubmit={handleSend}
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

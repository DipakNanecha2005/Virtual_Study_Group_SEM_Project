// const Chat = () => {
//   return <div>Chat</div>;
// };

// export default Chat;

import React, { useState, useEffect } from 'react';
import './Chat.css'; // Importing the CSS file for styling
import io from 'socket.io-client';

const socket = io("http://localhost:5000", {
  query: { userId: "6802927eafcfdfdfa12d0e3b" }
});
// const chatId = "680723cfd3d05fa9d2126e25";
// const userId = ""

const Chat = ({ userId, chatId, username, avatarUrl }) => {
  const [message, setMessage] = useState(""); // State for the current input message
  const [messages, setMessages] = useState([]); // State for all messages
  const [typing, setTyping] = useState(false); // Typing indicator
  const [file, setFile] = useState(null); // For file attachment
//   console.log('chatId:', chatId);
// console.log('username:', username);
  
  useEffect(() => {
    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for typing indicator
    socket.on("userTyping", (data) => {
      if (data.chatId === chatId) {
        setTyping(true);
      }
    });

    socket.on("userOffline", (userId) => {
      console.log(`User ${userId} went offline`);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userOffline");
    };
  }, [chatId]);

  // Handle input message change
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    socket.emit("userTyping", { chatId, userId });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: userId,
        messageType: "text",
        content: message,
        chatId
      };
      console.log({message, newMessage});
      
      socket.emit("newMessage", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(""); // Clear input after sending
    }
  };

  // Handle file attachment
  const handleFileAttach = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const fileUrl = URL.createObjectURL(uploadedFile);
      setFile(uploadedFile);
      const fileMessage = {
        sender: userId,
        messageType: "file",
        fileUrl,
        chatId
      };
      socket.emit("fileUpload", fileMessage);
    }
  };

  // Handle back button (for navigation)
  const handleBack = () => {
    // For example: navigate to the previous page
    alert("Back button clicked!");
  };

  return (
    <div className="chat-container">
      {/* Top Bar */}
      <div className="top-bar">
        <button className="back-btn" onClick={handleBack}>
          &#8592;
        </button>
        <div className="user-info">
          <span className="username">{username}</span>
          <img src={avatarUrl} alt="User Avatar" className="avatar" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === userId ? 'outgoing' : 'incoming'}`}>
            {msg.messageType === 'text' 
            ? msg.content 
            : <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">File Attachment</a>}
          </div>
        ))}
        {typing && <div className="typing-indicator">User is typing...</div>}
      </div>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Type a message..."
          className="message-input"
        />
        <button className="send-btn" onClick={handleSendMessage}>
          Send
        </button>
        <label htmlFor="file-upload" className="attach-btn">
          +
        </label>
        <input
          type="file"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleFileAttach}
        />
      </div>
    </div>
  );
};

export default Chat;

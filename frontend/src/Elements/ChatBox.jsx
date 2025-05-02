import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useSocket } from '../context/SocketProvider'; // adjust path if needed

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const { userInfo } = useSelector((state) => state.user);
  const socket = useSocket();

  // Scroll to the latest message
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages
  const fetchMessages = async () => {
    if (!selectedChat || !selectedChat.chat_id) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/message/${selectedChat.chat_id}`,
        { withCredentials: true }
      );

      setMessages(res.data.messages || []);

      // Join the chat room via socket
      socket?.emit('join chat', selectedChat.chat_id);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when selected chat changes
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  // Auto-scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (
        selectedChat &&
        newMessage.chat_id === selectedChat.chat_id
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on('message received', handleNewMessage);

    return () => {
      socket.off('message received', handleNewMessage);
    };
  }, [socket, selectedChat]);

  return (
    <div>
      {selectedChat ? (
        <div>
          <h1>Chat Profile</h1>
          <p><strong>Full Name:</strong> {selectedChat.fullName}</p>
          <p><strong>Username:</strong> {selectedChat.username}</p>
          <p><strong>User ID:</strong> {selectedChat._id}</p>
          <p><strong>Profile Complete:</strong> {selectedChat.isProfileComplete ? 'Yes' : 'No'}</p>
          <p><strong>Created At:</strong> {new Date(selectedChat.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(selectedChat.updatedAt).toLocaleString()}</p>
          <p><strong>Last Message:</strong> {selectedChat.lastMessage || 'No message yet'}</p>
          <p><strong>Chat ID:</strong> {selectedChat.chat_id || 'No Chat Yet'}</p>

          <div style={{ marginTop: '20px' }}>
            <h2>Messages</h2>
            {loading ? (
              <p>Loading messages...</p>
            ) : messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg._id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                  <p><strong>{msg.sender?.username || 'Unknown'}:</strong> {msg.content}</p>
                  <p style={{ fontSize: '0.8em', color: '#777' }}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No messages yet.</p>
            )}
            <div ref={messageEndRef} />
          </div>
        </div>
      ) : (
        <h1>No Chat Selected</h1>
      )}
    </div>
  );
};

export default ChatBox;

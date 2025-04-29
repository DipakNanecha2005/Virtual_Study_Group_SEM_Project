import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { getSender } from '../../config/ChatLogics';
import './MyChats.css'

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/chat/${user._id}`, {
        withCredentials: true,
      });
      setChats(data);
    } catch (error) {
      toast.error(`Error fetching chats: ${error.message}`, {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="mychats-container">
      <div className="mychats-header">
        <h2>My Chats</h2>
        <button className="new-group-button">
          + New Group Chat
        </button>
      </div>

<div className="chats-list">
  {Array.isArray(chats) ? (
    chats.map((chat) => (
      <div
        key={chat._id}
        className={`chat-item ${selectedChat?._id === chat._id ? 'selected' : ''}`}
        onClick={() => setSelectedChat(chat)}
      >
        <div className="chat-name">
          {chat.isGroupChat
            ? chat.chatName
            : getSender(loggedUser, chat.users)}
        </div>
        {chat.latestMessage && (
          <div className="chat-latest-message">
            <strong>{chat.latestMessage.sender.name}: </strong>
            {chat.latestMessage.content.length > 50
              ? chat.latestMessage.content.substring(0, 50) + '...'
              : chat.latestMessage.content}
          </div>
        )}
      </div>
    ))
  ) : (
    <div>Loading chats...</div>
  )}
</div>


      <ToastContainer />
    </div>
  );
};

export default MyChats;

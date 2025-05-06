import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserListItem from '../Elements/UserAvatar/UserListItem';
import { setSelectedChat } from '../redux/chatSlice';
import { SideDrawer } from '../Elements/SideDrawer';

const ContactsList = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats || []);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const onlineUsers = useSelector((state) => state.user.onlineUsers) || []; // Ensure onlineUsers is an array

  // Debugging: Check if onlineUsers is being fetched correctly
  useEffect(() => {
    console.log("Online Users:", onlineUsers); // Logs the onlineUsers data
  }, [onlineUsers]);

  const handleChatSelect = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  const sortedChats = [...chats].sort((a, b) => {
    const timeA = a.lastMessage?.sendAt ? new Date(a.lastMessage.sendAt).getTime() : 0;
    const timeB = b.lastMessage?.sendAt ? new Date(b.lastMessage.sendAt).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="card h-100 d-flex flex-column">
      <div className="card-header">
        <SideDrawer />
      </div>
      <div className="flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
        <ul className="list-group list-group-flush">
          {sortedChats.length > 0 ? (
            sortedChats.map((user) => {
              const isOnline = onlineUsers.some(
                (onlineUser) => onlineUser._id === user._id
              );
              
              // Debugging: Log to see if isOnline works as expected
              console.log(`Checking user ${user.fullName}: ${isOnline ? 'Online' : 'Offline'}`);

              return (
                <li
                  key={user.chat_id}
                  className={`list-group-item ${
                    selectedChat?.chat_id === user.chat_id ? 'active' : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleChatSelect(user)}
                >
                  <UserListItem user={user} isOnline={isOnline} />
                </li>
              );
            })
          ) : (
            <li className="list-group-item text-muted">No chats found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ContactsList;

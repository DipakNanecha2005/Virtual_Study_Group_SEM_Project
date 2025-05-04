import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserListItem from '../Elements/UserAvatar/UserListItem';
import { setSelectedChat } from '../redux/chatSlice';

const ContactsList = () => {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chat.chats);
  const selectedChat = useSelector(state => state.chat.selectedChat);

  const handleChatSelect = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  return (
    <div className="card h-100 d-flex flex-column">
      <div className="card-header"><b>Contacts</b></div>
      <div className="flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
        <ul className="list-group list-group-flush">
          {chats.length > 0 ? (
            chats.map((user) => (
              <li
                key={user.chat_id}
                className={`list-group-item ${selectedChat?.chat_id === user.chat_id ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleChatSelect(user)}
              >
                <UserListItem user={user} />
              </li>
            ))
          ) : (
            <p className="p-2">No chats found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ContactsList;

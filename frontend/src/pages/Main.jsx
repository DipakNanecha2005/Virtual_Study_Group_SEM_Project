import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { setChats, setSelectedChat } from '../redux/chatSlice';
import UserListItem from '../Elements/UserAvatar/UserListItem';
import SideDrawer from '../Elements/SideDrawer';
import { useSocket } from '../context/SocketProvider'; // adjust path if needed


const Main = () => {
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const messageEndRef = useRef(null);
  const socket = useSocket()

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const chats = useSelector((state) => state.chat.chats);

  

  const fetchMessages = async () => {
    if (!selectedChat || !selectedChat.chat_id) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/message/${selectedChat.chat_id}`,
        { withCredentials: true }
      );
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const newMessage = {
      content: newMsg,
      sender: userInfo._id,
      chat_id: selectedChat.chat_id,
    };
    
    
    // Send message via API or socket
    try {
      const res = await axios.post(
        'http://localhost:5000/message/send',
        newMessage,
        { withCredentials: true }
      );
      setMessages((prevMessages) => [...prevMessages, res.data.message]);
      socket?.emit('new message', res.data.message);
      setNewMsg('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    console.log('SelectedChats is ',selectedChat)
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (selectedChat && newMessage.chat_id === selectedChat.chat_id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on('message received', handleNewMessage);
    return () => {
      socket.off('message received', handleNewMessage);
    };
  }, [socket, selectedChat]);

  return (
    <div className="container-fluid" style={{ height: '100vh'}}>
      <div className="row h-100">
        < SideDrawer/>
        <div className="col-md-4 d-flex flex-column h-100" style={{ borderRight: '1px solid #ccc' }}>
          <div className="card h-100 d-flex flex-column">
            <div className="card-header">
              <b>Contacts</b>
            </div>
            <div
              className="flex-grow-1 overflow-auto"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <ul className="list-group list-group-flush">
                {chats.length > 0 ? (
                  chats.map((user) => (
                    <li
                      key={user.chat_id}
                      className={`list-group-item ${
                        selectedChat?.chat_id === user.chat_id ? 'active' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      // onClick={() => dispatch(setSelectedChat(user))}
                    >
                      <UserListItem user={user} handleFunction={() => dispatch(setSelectedChat(user))} />
                    </li>
                  ))
                ) : (
                  <p className="p-2">No chats found</p>
                )}
              </ul>
            </div>
          </div>
        </div>
  
        {/* Chat Area */}
        <div className="col-md-8 d-flex flex-column h-100">
          <div className="card h-100 d-flex flex-column">
            <div className="card-header">
              <b>Chat with {selectedChat ? selectedChat._id : 'No Chat Selected'}</b>
            </div>
  
            {/* Scrollable Messages */}
            <div
              className="flex-grow-1 overflow-auto p-3"
              style={{ background: '#f8f9fa' }}
            >
              {loading ? (
                <p>Loading messages...</p>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`d-flex ${
                      msg.sender === userInfo._id ? 'justify-content-end' : 'justify-content-start'
                    } mb-2`}
                  >
                    <div
                      className={`p-2 rounded ${
                        msg.sender === userInfo._id ? 'bg-primary text-white' : 'bg-light'
                      }`}
                      style={{ maxWidth: '70%' }}
                    >
                      <div>{msg.content}</div>
                      <small className="text-muted">
                        {new Date(msg.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p>No messages yet</p>
              )}
              <div ref={messageEndRef} />
            </div>
  
            {/* Sticky Message Input */}
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
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <button type="submit" className="btn btn-primary ms-2">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  
};

export default Main;

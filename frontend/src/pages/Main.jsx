import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { setChats, setSelectedChat } from '../redux/chatSlice';
import UserListItem from '../Elements/UserAvatar/UserListItem';
import SideDrawer from '../Elements/SideDrawer';
import { useSocket } from '../context/SocketProvider';

const Main = () => {
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);
  const socket = useSocket();

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const chats = useSelector((state) => state.chat.chats);

  // Fetch chats for the logged-in user
  useEffect(() => {
    const fetchChats = async () => {
      if (!userInfo || !userInfo._id) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/chat/${userInfo._id}`, {
          withCredentials: true,
        });
        const formattedChats = response.data.chats.map(chat => {
          const secondUser = chat.members.find(member => member._id !== userInfo._id);
          return {
            _id: secondUser._id,
            fullName: secondUser.fullName,
            username: secondUser.username,
            isProfileComplete: secondUser.isProfileComplete,
            lastMessage: chat.lastMessage,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            chat_id: chat._id,
          };
        });
        dispatch(setChats(formattedChats));
      } catch (error) {
        toast.error('Error fetching chats');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [userInfo]);

  // Fetch messages for the selected chat
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
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a new message
  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const messagePayload = {
      content: newMsg,
      sender: userInfo._id,
      chatId: selectedChat.chat_id,
      messageType: "text",
    };

    try {
      socket.emit("newMessage", messagePayload); // socket send
      setNewMsg('');
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  // Scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Receive real-time message
    socket.on("receiveMessage", (newMessage) => {
      if (selectedChat && newMessage.chatId === selectedChat.chat_id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    // Typing indicator
    socket.on("userTyping", (data) => {
      if (data.chatId === selectedChat.chat_id && data.userId !== userInfo._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000); // Hide typing after 2 seconds
      }
    });

    // Chat created, updated
    socket.on("chatCreated", (newChat) => {
      dispatch(setChats([...chats, newChat]));
    });
    socket.on("chatUpdated", (updatedChat) => {
      const updated = chats.map(chat => chat._id === updatedChat._id ? updatedChat : chat);
      dispatch(setChats(updated));
    });

    // User added/removed from chat
    socket.on("userAddedToChat", ({ chatId }) => {
      toast.info("You were added to a chat");
    });
    socket.on("userRemovedFromChat", ({ chatId }) => {
      if (selectedChat.chat_id === chatId) {
        dispatch(setSelectedChat(null));
        toast.warn("You were removed from the chat");
      }
    });

    // File message received
    socket.on("fileReceived", (fileMsg) => {
      if (fileMsg.chatId === selectedChat.chat_id) {
        setMessages((prev) => [...prev, fileMsg]);
      }
    });

    // Message deleted
    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter(msg => msg._id !== messageId));
    });

    // User online/offline
    socket.on("userOnline", (userId) => {
      console.log("User online:", userId);
    });
    socket.on("userOffline", (userId) => {
      console.log("User offline:", userId);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("chatCreated");
      socket.off("chatUpdated");
      socket.off("userAddedToChat");
      socket.off("userRemovedFromChat");
      socket.off("fileReceived");
      socket.off("messageDeleted");
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [socket, selectedChat, chats]);

  // Handle typing input
  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("userTyping", {
        chatId: selectedChat.chat_id,
        userId: userInfo._id,
      });
      setTimeout(() => setTyping(false), 1500); // Stop typing after 1.5 seconds of inactivity
    }
  };

  return (
    <div className="container-fluid" style={{ height: '100vh' }}>
      <div className="row h-100">
        <SideDrawer />
        <div className="col-md-4 d-flex flex-column h-100" style={{ borderRight: '1px solid #ccc' }}>
          <h1>{userInfo.fullName}</h1>
          <div className="card h-100 d-flex flex-column">
            <div className="card-header">
              <b>Contacts</b>
            </div>
            <div className="flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
              <ul className="list-group list-group-flush">
                {chats.length > 0 ? (
                  chats.map((user) => (
                    <li
                      key={user.chat_id}
                      className={`list-group-item ${selectedChat?.chat_id === user.chat_id ? 'active' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => dispatch(setSelectedChat(user))}
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
        </div>

        <div className="col-md-8 d-flex flex-column h-100">
          <div className="card h-100 d-flex flex-column">
            <div className="card-header">
              <b>Chat with {selectedChat ? selectedChat.fullName : 'No Chat Selected'}</b>
            </div>

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
                        style={{
                          maxWidth: '70%',
                          wordBreak: 'break-word',
                          borderRadius: '20px',
                        }}
                      >
                        {msg.messageType === "file" ? (
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
              {isTyping && <p className="text-muted">Opponent is typing...</p>}
              <div ref={messageEndRef} />
            </div>

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
                <button type="submit" className="btn btn-primary ml-2">Send</button>
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

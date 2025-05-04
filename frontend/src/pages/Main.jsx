import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setChats, setSelectedChat } from '../redux/chatSlice';
import { useSocket } from '../context/SocketProvider';
import MainLayout from '../Elements/MainLayout';

const Main = () => {
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const socket = useSocket();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const chats = useSelector((state) => state.chat.chats);

  // Fetch user chats
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

  // Fetch chat messages
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

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  // Handle send message
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

  // Typing handler
  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("userTyping", {
        chatId: selectedChat.chat_id,
        userId: userInfo._id,
      });
      setTimeout(() => setTyping(false), 1500);
    }
  };

  const handleBackToContacts = () => {
    dispatch(setSelectedChat(null));
  }
  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (newMessage) => {
      if (selectedChat && newMessage.chatId === selectedChat.chat_id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socket.on("userTyping", (data) => {
      if (data.chatId === selectedChat?.chat_id && data.userId !== userInfo._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });

    socket.on("chatCreated", (newChat) => {
      dispatch(setChats([...chats, newChat]));
    });

    socket.on("chatUpdated", (updatedChat) => {
      const updated = chats.map(chat => chat._id === updatedChat._id ? updatedChat : chat);
      dispatch(setChats(updated));
    });

    socket.on("userAddedToChat", ({ chatId }) => {
      toast.info("You were added to a chat");
    });

    socket.on("userRemovedFromChat", ({ chatId }) => {
      if (selectedChat?.chat_id === chatId) {
        dispatch(setSelectedChat(null));
        toast.warn("You were removed from the chat");
      }
    });

    socket.on("fileReceived", (fileMsg) => {
      if (fileMsg.chatId === selectedChat?.chat_id) {
        setMessages((prev) => [...prev, fileMsg]);
      }
    });

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter(msg => msg._id !== messageId));
    });

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

  return (
    <MainLayout
      messages={messages}
      isTyping={isTyping}
      userInfo={userInfo}
      selectedChat={selectedChat}
      loading={loading}
      handleSend={handleSend}
      newMsg={newMsg}
      handleTyping={handleTyping}
      onBack={handleBackToContacts}
    />
  );
};

export default Main;

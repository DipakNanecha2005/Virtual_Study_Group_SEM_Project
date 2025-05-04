import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../context/SocketProvider';
import MainLayout from '../Elements/MainLayout';
import { fetchChats, fetchMessages, sendMessage } from '../redux/messageThunks';
import { 
  addMessage, 
  removeMessage, 
  setIsTyping, 
  setNewMsg, 
  setTyping 
} from '../redux/uiSlice';
import { setChats, setSelectedChat } from '../redux/chatSlice';
import { toast } from 'react-toastify';
import { setSocket } from '../redux/socketSlice';

const Main = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const chats = useSelector((state) => state.chat.chats);


  //Store socket in Redux when available
  useEffect(() => {
    if(socket){
      dispatch(setSocket(socket));
    }
  },[socket,dispatch]);

  // Fetch user chats
  useEffect(() => {
    if (!userInfo || !userInfo._id) return;
    dispatch(fetchChats(userInfo._id));
  }, [userInfo, dispatch]);

  // Fetch chat messages
  useEffect(() => {
    if (!selectedChat || !selectedChat.chat_id) return;
    dispatch(fetchMessages(selectedChat.chat_id));
  }, [selectedChat, dispatch]);

  // Handle send message
  const handleSend = () => {
    dispatch(sendMessage({
      content: newMsg,
      userId: userInfo._id,
      chatId: selectedChat.chat_id,
      socket
    }));
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (newMessage) => {
      if (selectedChat && newMessage.chatId === selectedChat.chat_id) {
        dispatch(addMessage(newMessage));
      }
    });

    socket.on("userTyping", (data) => {
      if (data.chatId === selectedChat?.chat_id && data.userId !== userInfo._id) {
        dispatch(setIsTyping(true));
        setTimeout(() => dispatch(setIsTyping(false)), 2000);
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
        dispatch(addMessage(fileMsg));
      }
    });

    socket.on("messageDeleted", ({ messageId }) => {
      dispatch(removeMessage(messageId));
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
  }, [socket, selectedChat, chats, dispatch, userInfo]);

  return <MainLayout />;
};

export default Main;
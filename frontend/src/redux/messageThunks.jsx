import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setLoading, setMessages, addMessage, setNewMsg, setTyping } from './uiSlice';
import { setChats } from './chatSlice';

// Fetch user chats
export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (userId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      console.log("UserId for fetch Chats is -->", userId);
      const response = await axios.get(`http://localhost:5000/chat/${userId}`, {
        withCredentials: true,
      });
      
      const formattedChats = response.data.chats.map(chat => {
        const secondUser = chat.members.find(member => member._id !== userId);
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
      return formattedChats;
    } catch (error) {
      toast.error('Error fetching chats');
      console.log('Error fetching chats', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Fetch chat messages
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(
        `http://localhost:5000/message/${chatId}`,
        { withCredentials: true }
      );
      dispatch(setMessages(res.data.messages || []));
      return res.data.messages;
    } catch (error) {
      toast.error('Failed to load messages');
      console.log('Failed to load messages', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Send message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ content, userId, chatId }, { dispatch, getState }) => {
    if (!content.trim()) return;

    const messagePayload = {
      content,
      sender: userId,
      chatId,
      messageType: "text",
    };

    try {
        const socket = getState().socket.socket;
        if(!socket){
            toast.error("Socket connection not established");
            console.error('Socket is not available');
            return;
        }
      socket.emit("newMessage", messagePayload);
      dispatch(setNewMsg(''));
      return messagePayload;
    } catch (error) {
      toast.error("Failed to send message");
      console.log("Failed to send message",error)

      throw error;
    }
  }
);


export const handleUserTyping = createAsyncThunk(
    'chat/handleUserTyping',
    async({value,userId,chatId},{dispatch,getState}) => {
        dispatch(setNewMsg(value));

        const {typing} = getState().ui;

        const socket = getState().socket.socket;

        if(!typing && socket){
            dispatch(setTyping(true));

            socket.emit("userTyping", {
                chatId,
                userId,
            });

            setTimeout(() => {
                dispatch(setTyping(false));
            },1500)
        }
    }
)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  selectedChat: null,
  notifications: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    addNotification: (state, action) => {
      const { id, message, type, read = false } = action.payload;
      state.notifications.push({ id, message, type, read });
    },
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    removeChat: (state, action) => {
      state.chats = state.chats.filter(chat => chat._id !== action.payload);
    },
    updateChat: (state, action) => {
      const updatedChat = action.payload;
      state.chats = state.chats.map(chat =>
        chat._id === updatedChat._id ? updatedChat : chat
      );
    },
  },
});

export const { setChats, setSelectedChat, addNotification, clearNotifications, markNotificationAsRead, removeChat, updateChat } = chatSlice.actions;

export default chatSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newMsg: '',
  messages: [],
  loading: false,
  typing: false,
  isTyping: false,
  isMobile: window.innerWidth <= 768
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNewMsg: (state, action) => { state.newMsg = action.payload },
    setMessages: (state, action) => { state.messages = action.payload },
    addMessage: (state, action) => { state.messages.push(action.payload) },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(m => m._id !== action.payload);
    },
    setLoading: (state, action) => { state.loading = action.payload },
    setTyping: (state, action) => { state.typing = action.payload },
    setIsTyping: (state, action) => { state.isTyping = action.payload },
    setIsMobile: (state, action) => { state.isMobile = action.payload }
  }
});

export const {
  setNewMsg, setMessages, addMessage, removeMessage,
  setLoading, setTyping, setIsTyping, setIsMobile
} = uiSlice.actions;

export default uiSlice.reducer;
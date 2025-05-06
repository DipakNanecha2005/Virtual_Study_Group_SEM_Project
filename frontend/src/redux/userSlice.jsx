import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: {
    _id: '',
    fullName: '',
    username: '',
    avatar: '',
    email: '',
  },
  token: '',  
  onlineUsers: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = { ...action.payload };
    },
    setToken: (state, action) => {
      const { token } = action.payload;
      state.token = token;
    },
    logout: (state) => {
      state.userInfo = {
        _id: '',
        fullName: '',
        username: '',
        avatar: '',
        email: '',
      };
      state.token = '';
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state,action) => {
      const user = action.payload;
      if(!state.onlineUsers.find(u => u._id === user._id)){
        state.onlineUsers.push(user);
      }
    },
    removeOnlineUser: (state,action) => {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter((user) => user._id !== userId);
    }
  },
});

export const { setUser, setToken, logout, setOnlineUser, addOnlineUser,removeOnlineUser } = userSlice.actions;
export default userSlice.reducer;

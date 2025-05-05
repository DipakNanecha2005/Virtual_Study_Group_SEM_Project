import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: {
    _id: '',
    fullName: '',
    username: '',
    avatar: '',
    email: '',
  },
  token: '',  // No default token, it will be set on login
  onlineUser: [],
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
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    removeUser: (state, action) => {
      const userId = action.payload;
      state.onlineUser = state.onlineUser.filter((user) => user._id !== userId);
    },
  },
});

export const { setUser, setToken, logout, setOnlineUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

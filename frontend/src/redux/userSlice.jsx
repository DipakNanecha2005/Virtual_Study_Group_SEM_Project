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
  },
});

export const { setUser, setToken, logout, setOnlineUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

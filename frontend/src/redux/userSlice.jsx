import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: {
    _id: "",
    fullName: "",
    username: "",
    avatar: "",
    email: "",
  },
  token: "",
  onlineUser: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = { ...action.payload }; // Set user info
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token); // Persist token in localStorage
    },
    logout: (state) => {
      state.userInfo = { _id: "", fullName: "", username: "", avatar: "", email: "" }; // Reset user info
      state.token = "";
      localStorage.removeItem('token'); // Remove token on logout
    },
    setOnlineUser: (state, action) => {
      // Update online users, assuming payload contains an array of online users
      state.onlineUser = action.payload;
    },
    removeUser: (state, action) => {
      const userId = action.payload;
      state.onlineUser = state.onlineUser.filter(user => user._id !== userId); // Remove offline user
    },
  },
})

export const { setUser, setToken, logout, setOnlineUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

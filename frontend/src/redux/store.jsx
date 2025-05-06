import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import chatReducer from './chatSlice';
import uiReducer from './uiSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import socketReducer from './socketSlice';
import { createTransform } from 'redux-persist';

// Create a transform to filter out the circular references from the socket state
const socketTransform = createTransform(
  (inboundState) => {
    // Remove circular references or sensitive data you don't want to store
    const { io, ...rest } = inboundState;
    return rest; // Returning a simplified version of the socket state
  },
  (outboundState) => outboundState, // Don't modify the state when loading
);

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['socket'],
};

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  ui: uiReducer,
  socket: socketReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatBox = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socketConnection = io("http://localhost:5000"
      , {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketRef.current = socketConnection;

    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection.id);
    });

    socketConnection.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Cleanup on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return <div>Chat Box</div>;
};

export default ChatBox;

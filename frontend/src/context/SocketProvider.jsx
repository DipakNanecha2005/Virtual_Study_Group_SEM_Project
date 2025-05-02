import { createContext, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

const BASE_API_URL = "http://localhost:5000"; // Backend server
const AUTH_API = `${BASE_API_URL}/auth/user-info`;

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useSelector((state) => state.user); // ✅ Now it's inside component

  useEffect(() => {
    if (userInfo) {
      socket.current = io(BASE_API_URL, {
        withCredentials: true,
        query: { userId: userInfo._id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket:", socket.current.id);
      });

      socket.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

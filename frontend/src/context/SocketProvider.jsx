import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

const BASE_API_URL = "http://localhost:5000"; // Backend server
const AUTH_API = `${BASE_API_URL}/auth/user-info`;

export const SocketProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const socket = useRef(null);

  // Fetch user data once
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(AUTH_API, { withCredentials: true });
        const user = {
          _id: res.data._id,
          fullName: res.data.fullName,
          username: res.data.username,
          gender: res.data.gender,
          avatar: res.data.avatar,
        };
        setUserInfo(user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser();
  }, []);

  // Connect socket after user is fetched
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

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

const BASE_API_URL = "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      const socket = io(BASE_API_URL, {
        withCredentials: true,
        query: { userId: userInfo._id },
      });

      socket.on("connect", () => {
        console.log("Connected to socket:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      setSocketInstance(socket);

      return () => {
        socket.disconnect();
        setSocketInstance(null);
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};

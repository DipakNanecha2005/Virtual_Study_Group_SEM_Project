import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

const BASE = "http://localhost:5000";
const userInfoURL = `${BASE}/auth/user-info`

const userProfile = async () => {
    try {
        const res = await axios.get({
            userInfoURL,
            withCredentials: true
        });
        // if (res.success) {
        const data = {
            _id: res._id,
            fullName: res.fullName,
            username: res.username,
            gender: res.gender,
            avatar: res.avatar
        }
        return data;
        // }
    } catch (error) {
        console.log({ error });
    }
}
console.log("hello 1");

const userInfo = userProfile();

export const SocketProvider = ({ Children }) => {
    const socket = useRef();

    useEffect(() => {
        console.log({userInfo});
        if (userInfo) {
            socket.current = io({ BASE },
                {
                    withCredentials: true,
                    query: { userId: userInfo.id }
                })
        }
        socket.current.on("connect", () => {
            console.log("connected to socjet server");0
        })

        return () => {
            socket.current.disconnect();
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            { Children}
        </SocketContext.Provider>
    );
}
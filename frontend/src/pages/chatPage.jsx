import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MyChats from '../Elements/MyChats';
import ChatBox from '../Elements/ChatBox';
import Navbar from './Navbar';
import Spinner from '../Spinner/Spinner';
import SideDrawer from '../Elements/SideDrawer';
import axios from 'axios';
import { setChats } from '../redux/chatSlice';
import { toast } from 'react-toastify';


const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
    const { userInfo } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const chats = useSelector((state) => state.chats); // Access user info from Redux store
    const selectedChat = useSelector((state) => state.selectedChat);

  useEffect(() => {
      const fetchChats = async () => {
        if (!userInfo || !userInfo._id) return;
          setLoading(true);
        try {
          // GET request to fetch user chats
          const response = await axios.get(`http://localhost:5000/chat/${userInfo._id}`, {
            withCredentials: true,
          });
  
          console.log("respone.data.chat",response.data.chats);
  
          const formattedChats = response.data.chats.map(chat => {
            // Select the second user in the chat (index 1)
            const secondUser = chat.members[1];
  
            return {
              _id: secondUser._id,
              fullName: secondUser.fullName,
              username: secondUser.username,
              isProfileComplete: secondUser.isProfileComplete,
              lastMessage: chat.lastMessage, // Assuming the last message is available
              createdAt: chat.createdAt,
              updatedAt: chat.updatedAt,
              chat_id: chat._id,
            };
          });



          console.log('chats-->',formattedChats);
          dispatch(setChats(formattedChats));
          console.log("otherUsers",chats)

        } catch (error) {
          setError('Error fetching chats',error);
          console.log('GHEG',error)
          toast.error('Error fetching chats');
        } finally {
          setLoading(false);
        }
      };
      console.log(userInfo._id);
      fetchChats();
    }, [fetchAgain, userInfo]);
  

  return (
    <>
      <SideDrawer />
      <div className="container-fluid">
  <div className="row">
    {/* Left Component - 30% */}
    <div className="col-md-4">
      <MyChats fetchAgain={fetchAgain} />
    </div>

    {/* Right Component - 70% */}
    <div className="col-md-8">
      <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  </div>
</div>

    </>
  );
};

export default ChatPage;

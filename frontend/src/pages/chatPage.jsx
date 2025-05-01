import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MyChats from '../Elements/MyChats';
import ChatBox from '../Elements/ChatBox';
import Navbar from './Navbar';
import Spinner from '../Spinner/Spinner';
import SideDrawer from '../Elements/SideDrawer';

const ChatPage = () => {
  const user = useSelector((state) => state.user.userInfo); // Access user info from Redux store
  const [fetchAgain, setFetchAgain] = useState(false);


  

  return (
    <>
      <SideDrawer />
      <div style={{ width: '100%', padding: '10px 0' }}>
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </>
  );
};

export default ChatPage;

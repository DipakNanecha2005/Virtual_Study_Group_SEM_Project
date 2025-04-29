import React from 'react';
import { ChatState } from '../context/ChatProvider';
import MyChats from '../Elements/MyChats';
import ChatBox from '../Elements/ChatBox';
import SideDrawer from '../Elements/SideDrawer'; 
import Navbar from './Navbar';


const ChatPage = () => {
  const { user } = ChatState();

  if (!user) {
    return <div>Loading...</div>;  
  }

  return (
    <>
                <Navbar />
      <div style={{ width: '100%' }}>
        {user && <SideDrawer />}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {user && <MyChats />}
          {user && <ChatBox />}
        </div>
      </div>
    </>
  );
};


export default ChatPage;

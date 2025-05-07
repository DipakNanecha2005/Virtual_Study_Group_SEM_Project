// GroupLayout.js
import React, { useState, useEffect } from 'react';
import GroupList from './GroupList';
import GroupChatBox from './GroupChatBox';
import SideDrawer from '../Elements/SideDrawer';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

const GroupLayout = ({
  messages,
  newMsg,
  handleSend,
  handleTyping,
  isTyping,
  loading,
  userInfo,
  onBack,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container-fluid" style={{ height: '100vh' }}>
      <div className="row h-100">
        <SideDrawer />
        {isMobile ? (
          !selectedChat ? (
            <div className="col-12">
              {/* Choose between contacts or groups list */}
              <GroupList isMobile={true} />
            </div>
          ) : (
            <div className="col-12">
              <GroupChatBox
                messages={messages}
                isTyping={isTyping}
                userInfo={userInfo}
                selectedChat={selectedChat}
                loading={loading}
                handleSend={handleSend}
                newMsg={newMsg}
                handleTyping={handleTyping}
              />
            </div>
          )
        ) : (
          <>
            <div className="col-md-4 d-flex flex-column h-100" style={{ borderRight: '1px solid #ccc' }}>
              {/* Choose between contacts or groups list */}
              <GroupList />
            </div>
            <div className="col-md-8 d-flex flex-column h-100">
              <GroupChatBox
                messages={messages}
                isTyping={isTyping}
                userInfo={userInfo}
                selectedChat={selectedChat}
                loading={loading}
                handleSend={handleSend}
                newMsg={newMsg}
                handleTyping={handleTyping}
                onBack={onBack}
              />
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default GroupLayout;

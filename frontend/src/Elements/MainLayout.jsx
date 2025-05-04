import React, { useState, useEffect } from 'react';
import ContactsList from './ContactsList';
import ChatBox from './ChatBox';
import SideDrawer from '../Elements/SideDrawer';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

const MainLayout = ({
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
              <ContactsList isMobile={true} />
            </div>
          ) : (
            <div className="col-12">
              <ChatBox
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
              <ContactsList />
            </div>
            <div className="col-md-8 d-flex flex-column h-100">
              <ChatBox
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

export default MainLayout;

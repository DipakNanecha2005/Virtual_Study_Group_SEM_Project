import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import ContactsList from './ContactsList';
import ChatBox from './ChatBox';
import { setIsMobile } from '../redux/uiSlice';
import Navbar from '../pages/Navbar';

const MainLayout = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const { isMobile } = useSelector((state) => state.ui);
  
  useEffect(() => {
    const handleResize = () => dispatch(setIsMobile(window.innerWidth <= 768));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <>
    <Navbar/>
    <div className="container-fluid" style={{ height: '100vh' }}>
      <div className="row h-100">
        {isMobile ? (
          !selectedChat ? (
            <div className="col-12">
              <ContactsList />
            </div>
          ) : (
            <div className="col-12">
              <ChatBox />
            </div>
          )
        ) : (
          <>
            <div className="col-md-4 d-flex flex-column h-100" style={{ borderRight: '1px solid #ccc' }}>
              <ContactsList />
            </div>
            <div className="col-md-8 d-flex flex-column h-100">
              <ChatBox />
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
    </>
  );
};

export default MainLayout;

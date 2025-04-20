import React from 'react'
import ChatUI from '../Elements/ChatUI'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar'

const chatPage = () => {
  return (
    <>
        <Navbar/>
        <div className='container mt-5'>
        <h2 className="mb-4 text-center">
                    Welcome to Your Study Chats 
        </h2>
        <ChatUI/>

        </div>

            <footer className="bg-dark text-white text-center mt-5 py-3">
                <p className="mb-0">© {new Date().getFullYear()} Virtual Study Group. All rights reserved.</p>
            </footer>
    </>
  )
}

export default chatPage

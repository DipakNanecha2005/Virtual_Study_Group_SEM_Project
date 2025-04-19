import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../pages/Navbar';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Alice', text: 'Hey there!', time: '10:00 AM', fromMe: false },
        { id: 2, sender: 'You', text: 'Hi Alice!', time: '10:01 AM', fromMe: true },
    ]);

    const [newMessage, setNewMessage] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const newMsg = {
            id: messages.length + 1,
            sender: 'You',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fromMe: true
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid p-0 bg-light" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
                <div className="d-flex align-items-center justify-content-center" style={{ height: 'calc(100vh - 56px)' }}>
                    <div className="card shadow w-100" style={{ maxWidth: '500px', height: '80vh' }}>
                        <div className="card-header bg-primary text-white text-center">
                            <h5 className="mb-0">Chat with Alice</h5>
                        </div>

                        <div className="card-body d-flex flex-column" style={{ overflowY: 'auto' }}>
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`d-flex ${msg.fromMe ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                                >
                                    <div
                                        className={`p-2 rounded shadow-sm ${msg.fromMe ? 'bg-primary text-white' : 'bg-light'}`}
                                        style={{ maxWidth: '70%' }}
                                    >
                                        <div>{msg.text}</div>
                                        <small className="text-muted d-block text-end" style={{ fontSize: '0.7rem' }}>{msg.time}</small>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="card-footer">
                            <form onSubmit={handleSend} className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatPage;

import React, { useState } from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

// Dummy users
const dummyUsers = [
    { id: 1, fullName: 'Alice Johnson', username: 'alice' },
    { id: 2, fullName: 'Bob Smith', username: 'bob' },
    { id: 3, fullName: 'Charlie Patel', username: 'charlie' },
];

// Dummy messages
const dummyMessages = [
    { id: 1, sender: 'Alice Johnson', time: '10:00 AM', message: 'Hey team!' },
    { id: 2, sender: 'Bob Smith', time: '10:05 AM', message: 'Hi Alice!' },
    { id: 3, sender: 'Charlie Patel', time: '10:07 AM', message: 'Morning everyone!' },
];

const Messages = () => {
    const [contactSearch] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(dummyMessages);
    const [selectedUser, setSelectedUser] = useState(null); // Track selected user

    const filteredContacts = dummyUsers.filter(user =>
        user.fullName.toLowerCase().includes(contactSearch.toLowerCase()) ||
        user.username.toLowerCase().includes(contactSearch.toLowerCase())
    );

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            const newMsg = {
                id: messages.length + 1,
                sender: 'You',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: newMessage
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setMessages([]); // Clear existing messages or load messages for selected user
    };

    return (
        <div>
            <Navbar />

            <div className="container mt-5">
                <h2 className="mb-4">Private Messages</h2>

                <div className="row">
                    {/* List of Users */}
                    <div className="col-md-4">
                        <h4>Contacts</h4>
                        <div className="list-group">
                            {filteredContacts.map(user => (
                                <button
                                    key={user.id}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleUserClick(user)}
                                >
                                    {user.fullName}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="col-md-8">
                        {selectedUser ? (
                            <div className="card shadow">
                                <div className="card-header bg-primary text-white">
                                    Chat with {selectedUser.fullName}
                                </div>

                                <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {messages.map(msg => (
                                        <div key={msg.id} className="mb-3">
                                            <strong>{msg.sender}</strong> <small className="text-muted">{msg.time}</small>
                                            <div className="bg-light p-2 rounded">{msg.message}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="card-footer">
                                    <form className="d-flex gap-2" onSubmit={handleSendMessage}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Type your message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-primary">Send</button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-info">
                                <p>Select a user to start a chat.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="bg-dark text-white text-center mt-5 py-3">
                <p className="mb-0">© {new Date().getFullYear()} Virtual Study Group. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Messages;

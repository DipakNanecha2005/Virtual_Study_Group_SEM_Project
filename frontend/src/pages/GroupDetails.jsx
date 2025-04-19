import React, { useState } from 'react';

const GroupDetails = () => {
    // Dummy data for group
    const group = {
        id: '123',
        name: 'DSA Crackers',
        description: 'A group focused on mastering DSA together.',
        members: [
            { id: 'u1', username: 'Digvijay' },
            { id: 'u2', username: 'Aayush' },
            { id: 'u3', username: 'Karan' }
        ],
    };

    // Dummy initial chat
    const [chat, setChat] = useState([
        { sender: 'Digvijay', text: 'Hey everyone!' },
        { sender: 'Aayush', text: 'Let’s solve some Leetcode today.' }
    ]);
    const [message, setMessage] = useState('');

    // Handle sending message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() !== '') {
            const newMsg = { sender: 'You', text: message };
            setChat([...chat, newMsg]);
            setMessage('');
        }
    };

    return (
        <div className="container mt-5">
            <h2>{group.name}</h2>
            <p className="text-muted">{group.description}</p>

            <h5 className="mt-4">Group Members</h5>
            <ul className="list-group mb-4">
                {group.members.map((member) => (
                    <li key={member.id} className="list-group-item">
                        {member.username}
                    </li>
                ))}
            </ul>

            <h5>Group Chat</h5>
            <div className="border rounded p-3 mb-3" style={{ height: '250px', overflowY: 'auto' }}>
                {chat.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
        </div>
    );
};

export default GroupDetails;

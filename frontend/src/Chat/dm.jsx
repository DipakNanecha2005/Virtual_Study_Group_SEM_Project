import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./dm.css";

const socket = io("http://localhost:5000");

const ChatBetweenTwo = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [tempCurrentUser, setTempCurrentUser] = useState("testUser1"); // Default test user

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chats/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.messages) {
            setMessages(data.messages);
            scrollToBottom();
          } else {
            console.error("Failed to fetch messages: Invalid response format");
          }
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.emit("join_room", chatId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]); // Expecting the whole message object now
      scrollToBottom();
    });

    return () => {
      socket.emit("leave_room", chatId);
      socket.off("receive_message");
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: { _id: tempCurrentUser, username: tempCurrentUser }, // Use temp user
      content: input,
      chat: chatId, // Backend expects 'chat' instead of 'chatId' in message object
      createdAt: new Date(), // Add timestamp to the message
      _id: Math.random().toString(36).substring(7), // Temporary ID for optimistic update
    };

    socket.emit("send_message", newMessage); // Send the entire newMessage object

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    scrollToBottom();
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat Room: {chatId}</header>

      {/* Temporary user identifier for testing */}
      <div>
        Testing as user: <strong>{tempCurrentUser}</strong>
        {/* Optional: Add an input to change the test user */}
        {/* <input
          value={tempCurrentUser}
          onChange={(e) => setTempCurrentUser(e.target.value)}
          placeholder="Enter test user ID"
        /> */}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat-bubble ${msg.sender._id === tempCurrentUser ? "user-a" : "user-b"}`}
          >
            <div className="sender-name">{msg.sender.username}</div>
            <div>{msg.content}</div>
            {msg.sender._id === tempCurrentUser && (
              <button className="delete-btn" onClick={() => deleteMessage(msg._id)}>
                ✖
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-inputs">
        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button onClick={sendMessage} className="send-btn-a">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBetweenTwo;

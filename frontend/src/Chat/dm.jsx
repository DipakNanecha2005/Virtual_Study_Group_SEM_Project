
import React, { useEffect, useState, useRef } from "react";
import "./dm.css";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5173"); // Replace with your backend server

console.log("ChatBetweenTwo component loaded");

const ChatBetweenTwo = ({ chatId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Join the chat room
    socket.emit("join_room", chatId);

    // Listen for real-time messages
    socket.on("receive_message", (data) => {
      if (data.chatId === chatId) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => {
      socket.emit("leave_room", chatId);
      socket.off("receive_message");
    };
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(
        `/api/messages/${chatId}`,
        { content: input },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setInput("");
      setMessages((prev) => [...prev, res.data]);
      scrollToBottom();
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat Room</header>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat-bubble ${
              msg.sender._id === currentUser ? "user-a" : "user-b"
            }`}
          >
            <div className="sender-name">
              {msg.sender.username || "Anonymous"}
            </div>
            <div>{msg.content}</div>
            {msg.sender._id === currentUser && (
              <button
                className="delete-btn"
                onClick={() => deleteMessage(msg._id)}
              >
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

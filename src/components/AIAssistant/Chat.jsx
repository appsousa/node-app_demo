import React from "react";
import "./Chat.css";

const Chat = ({ messages, chatEndRef }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${
            message.role === "user" ? "user-message" : "assistant-message"
          }`}
        >
          <div className="message-content">{message.content}</div>
          <div className="message-timestamp">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default Chat;

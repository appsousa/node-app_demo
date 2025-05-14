import React, { useState, useEffect, useRef } from "react";
import "./SimpleAIAssistant.css";
//import "./AIAssistant.css";
//import "..components/SimpleAIAssistant.css";
// Componente Chat simplificado
const SimpleChat = ({ messages, chatEndRef }) => {
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
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

const SimpleAIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const chatEndRef = useRef(null);

  // Simula a primeira mensagem do assistente ao carregar o componente
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Olá! Sou seu assistente virtual. Como posso ajudar?",
      },
    ]);
  }, []);

  // Garante que o chat role para a mensagem mais recente
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (userInput.trim() === "") return;

    // Adiciona a mensagem do usuário
    const newUserMessage = {
      role: "user",
      content: userInput,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    // Processa a mensagem (versão simplificada)
    const message = userInput.toLowerCase();
    let responseContent = "";

    if (message.includes("olá") || message.includes("oi")) {
      responseContent = "Olá! Como posso ajudar você hoje?";
    } else if (message.includes("cliente")) {
      responseContent = "Vou abrir a lista de clientes para você.";
      setTimeout(() => {
        window.location.href = "/clients";
      }, 1000);
    } else if (message.includes("produto")) {
      responseContent = "Vou abrir a lista de produtos para você.";
      setTimeout(() => {
        window.location.href = "/products";
      }, 1000);
    } else if (message.includes("pedido")) {
      responseContent = "Vou abrir a lista de pedidos para você.";
      setTimeout(() => {
        window.location.href = "/orders";
      }, 1000);
    } else if (message.includes("ajuda")) {
      responseContent =
        "Posso ajudar você a navegar pelo sistema. Tente pedir para ver clientes, produtos ou pedidos.";
    } else {
      responseContent = "Entendi sua mensagem. Como posso ajudar com isso?";
    }

    // Adiciona a resposta do assistente após um pequeno delay
    setTimeout(() => {
      const newAssistantMessage = {
        role: "assistant",
        content: responseContent,
      };

      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
    }, 500);

    // Limpa o campo de entrada
    setUserInput("");
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`ai-assistant-container ${
        isExpanded ? "expanded" : "collapsed"
      }`}
    >
      <div className="ai-assistant-header">
        <h3>Assistente Virtual</h3>
        <button className="toggle-button" onClick={toggleExpansion}>
          {isExpanded ? "Minimizar" : "Expandir"}
        </button>
      </div>

      {isExpanded && (
        <div className="ai-assistant-content">
          <SimpleChat messages={messages} chatEndRef={chatEndRef} />

          <form onSubmit={handleSendMessage} className="message-input-form">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Digite sua mensagem..."
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SimpleAIAssistant;

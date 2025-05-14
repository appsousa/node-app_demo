import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../contexts/AppStateContext";
import Chat from "./Chat";
import AIActions from "./AIActions";
import { sendMessage, executeAction } from "../../services/aiAssistant";
import "./AIAssistant.css";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const navigate = useNavigate();
  const { appState, updateAppState } = useAppState();
  const chatEndRef = useRef(null);

  // Simula a primeira mensagem do assistente ao carregar o componente
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Olá! Sou seu assistente virtual. Posso ajudar com operações do sistema ou responder perguntas. Como posso ajudar hoje?",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  // Garante que o chat role para a mensagem mais recente
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (input.trim() === "" || isProcessing) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      // Envia a mensagem para o serviço de IA e recebe a resposta
      const response = await sendMessage(input, messages);

      // Se a resposta contém ações para executar
      if (response.actions && response.actions.length > 0) {
        // Adiciona uma mensagem explicando o que será feito
        const actionMessage = {
          role: "assistant",
          content: `Vou ${response.actions[0].description}. Um momento por favor...`,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, actionMessage]);

        // Executa a ação
        setActiveAction(response.actions[0]);
        const actionResult = await executeAction(response.actions[0]);

        // Atualiza o estado da aplicação conforme necessário
        if (actionResult.updateAppState) {
          updateAppState(actionResult.updateAppState);
        }

        // Se a ação envolve navegação, redireciona para a página correspondente
        if (actionResult.navigate) {
          navigate(actionResult.navigate);
        }

        // Adiciona mensagem com o resultado da ação
        const resultMessage = {
          role: "assistant",
          content: actionResult.message || "Ação concluída com sucesso!",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, resultMessage]);
        setActiveAction(null);
      } else {
        // Apenas responde com texto se não houver ações
        const assistantMessage = {
          role: "assistant",
          content: response.message,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);

      const errorMessage = {
        role: "assistant",
        content:
          "Desculpe, tive um problema ao processar sua solicitação. Pode tentar novamente?",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
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

      <div className="ai-assistant-content">
        <Chat messages={messages} chatEndRef={chatEndRef} />

        {activeAction && <AIActions action={activeAction} />}

        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isProcessing}
          />
          <button type="submit" disabled={isProcessing || input.trim() === ""}>
            {isProcessing ? "Processando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;

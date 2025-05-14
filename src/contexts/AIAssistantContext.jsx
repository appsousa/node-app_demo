import React, { createContext, useContext, useState } from "react";

// Criando o contexto
const AIAssistantContext = createContext();

// Provider do contexto
export const AIAssistantProvider = ({ children }) => {
  const [assistantState, setAssistantState] = useState({
    isActive: false,
    currentView: null,
    chatHistory: [],
    pendingActions: [],
    lastExecutedAction: null,
  });

  // Ativa ou desativa o assistente
  const toggleAssistant = () => {
    setAssistantState((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  // Atualiza o estado da tela atual que o assistente está visualizando
  const updateCurrentView = (viewName) => {
    setAssistantState((prev) => ({
      ...prev,
      currentView: viewName,
    }));
  };

  // Adiciona uma mensagem ao histórico do chat
  const addMessageToHistory = (message) => {
    setAssistantState((prev) => ({
      ...prev,
      chatHistory: [...prev.chatHistory, message],
    }));
  };

  // Registra uma ação a ser executada pelo assistente
  const queueAction = (action) => {
    setAssistantState((prev) => ({
      ...prev,
      pendingActions: [...prev.pendingActions, action],
    }));
  };

  // Remove a primeira ação da fila e a marca como executada
  const dequeueAction = () => {
    if (assistantState.pendingActions.length === 0) return null;

    const [nextAction, ...remainingActions] = assistantState.pendingActions;

    setAssistantState((prev) => ({
      ...prev,
      pendingActions: remainingActions,
      lastExecutedAction: nextAction,
    }));

    return nextAction;
  };

  // Reseta o assistente para o estado inicial
  const resetAssistant = () => {
    setAssistantState({
      isActive: false,
      currentView: null,
      chatHistory: [],
      pendingActions: [],
      lastExecutedAction: null,
    });
  };

  // Valores expostos pelo contexto
  const contextValue = {
    assistantState,
    toggleAssistant,
    updateCurrentView,
    addMessageToHistory,
    queueAction,
    dequeueAction,
    resetAssistant,
  };

  return (
    <AIAssistantContext.Provider value={contextValue}>
      {children}
    </AIAssistantContext.Provider>
  );
};

// Custom hook para usar o contexto
export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error(
      "useAIAssistant deve ser usado dentro de um AIAssistantProvider"
    );
  }
  return context;
};

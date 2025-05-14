import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../contexts/AppStateContext";
import { useAIAssistant } from "../../contexts/AIAssistantContext";
import Chat from "./Chat";
import AIActions from "./AIActions";
import "./AIAssistant.css";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const navigate = useNavigate();
  const { appState, updateAppState } = useAppState();
  const { updateCurrentView } = useAIAssistant();
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

  // Função para processar mensagens localmente (sem backend)
  const processMessageLocally = (userInput) => {
    // Converte para lowercase para facilitar comparações
    const message = userInput.toLowerCase();

    // Verifica navegação
    if (
      message.includes("ir para") ||
      message.includes("abrir") ||
      message.includes("mostrar") ||
      message.includes("exibir") ||
      message.includes("listar")
    ) {
      if (message.includes("cliente")) {
        return {
          message: "Vou abrir a lista de clientes para você.",
          actions: [
            {
              type: "navigation",
              target: "clients",
              description: "abrir a lista de clientes",
            },
          ],
        };
      }

      if (message.includes("produto")) {
        return {
          message: "Vou abrir a lista de produtos para você.",
          actions: [
            {
              type: "navigation",
              target: "products",
              description: "abrir a lista de produtos",
            },
          ],
        };
      }

      if (message.includes("pedido")) {
        return {
          message: "Vou abrir a lista de pedidos para você.",
          actions: [
            {
              type: "navigation",
              target: "orders",
              description: "abrir a lista de pedidos",
            },
          ],
        };
      }

      if (
        message.includes("home") ||
        message.includes("início") ||
        message.includes("principal") ||
        message.includes("dashboard")
      ) {
        return {
          message: "Vou abrir a página inicial para você.",
          actions: [
            {
              type: "navigation",
              target: "home",
              description: "abrir a página inicial",
            },
          ],
        };
      }
    }

    // Verifica ações de criação
    if (
      message.includes("criar") ||
      message.includes("adicionar") ||
      message.includes("novo") ||
      message.includes("cadastrar")
    ) {
      if (message.includes("cliente")) {
        return {
          message: "Vou preparar um formulário para cadastrar um novo cliente.",
          actions: [
            {
              type: "create",
              entity: "client",
              description:
                "preparar o formulário para cadastrar um novo cliente",
              formAction: "create",
            },
          ],
        };
      }

      if (message.includes("produto")) {
        return {
          message: "Vou preparar um formulário para cadastrar um novo produto.",
          actions: [
            {
              type: "create",
              entity: "product",
              description:
                "preparar o formulário para cadastrar um novo produto",
              formAction: "create",
            },
          ],
        };
      }

      if (message.includes("pedido")) {
        return {
          message: "Vou preparar um formulário para criar um novo pedido.",
          actions: [
            {
              type: "create",
              entity: "order",
              description: "preparar o formulário para criar um novo pedido",
              formAction: "create",
            },
          ],
        };
      }
    }

    // Respostas gerais para perguntas comuns
    if (
      message.includes("olá") ||
      message.includes("oi") ||
      message.includes("bom dia") ||
      message.includes("boa tarde") ||
      message.includes("boa noite")
    ) {
      return {
        message: "Olá! Como posso ajudar você hoje?",
        actions: [],
      };
    }

    if (
      message.includes("ajuda") ||
      message.includes("o que você pode fazer")
    ) {
      return {
        message:
          'Posso ajudar você a navegar pelo sistema, criar registros de clientes, produtos e pedidos, e responder perguntas sobre o sistema. Por exemplo, você pode pedir "mostrar lista de clientes" ou "criar novo produto".',
        actions: [],
      };
    }

    // Resposta padrão para mensagens não reconhecidas
    return {
      message:
        "Entendi sua solicitação. Como posso ajudar com isso? Posso navegar para páginas, criar registros ou responder perguntas sobre o sistema.",
      actions: [],
    };
  };

  // NOVA FUNÇÃO: Navegação direta via URL (como solução de emergência)
  const navigateDirectly = (path) => {
    console.log("Navegação direta do assistente para:", path);
    // Usa window.location para navegação direta
    window.location.href = path;
    return true;
  };

  // Simulação de execução de ação (sem backend)
  const executeActionLocally = (action) => {
    return new Promise((resolve) => {
      // Simulamos um pequeno atraso para parecer que há processamento
      setTimeout(() => {
        // Log para debug
        console.log("Executando ação:", action);

        // Dependendo do tipo de ação
        switch (action.type) {
          case "navigation":
            // Navegar para a tela solicitada
            let path = "/";

            if (action.target !== "home") {
              path = `/${action.target}`;
            }

            console.log(`Assistente navegando para: ${path}`);

            // ALTERAÇÃO AQUI: Usar navegação direta em vez de navigate()
            navigateDirectly(path);

            resolve({
              success: true,
              message: `Navegando para ${action.target}`,
              navigate: path,
            });
            break;

          case "create":
            // Preparar formulário para criar entidade
            let navigatePath;
            if (action.entity === "client") {
              navigatePath = "/clients";
              // Atualiza o estado para indicar que queremos criar um cliente
              updateAppState({
                activeOperation: {
                  type: "create",
                  entityType: "client",
                },
              });
            } else if (action.entity === "product") {
              navigatePath = "/products";
            } else if (action.entity === "order") {
              navigatePath = "/orders";
            }

            console.log(
              `Assistente navegando para formulário: ${navigatePath}`
            );

            // ALTERAÇÃO AQUI: Usar navegação direta em vez de navigate()
            navigateDirectly(navigatePath);

            resolve({
              success: true,
              message: `Preparando formulário para criar ${action.entity}`,
              navigate: navigatePath,
            });
            break;

          default:
            resolve({
              success: false,
              message: "Não foi possível executar essa ação.",
              navigate: null,
            });
        }
      }, 1000); // Simulação de 1 segundo de processamento
    });
  };

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
      // Processamos a mensagem localmente (sem backend)
      const response = processMessageLocally(input);

      // Se a resposta contém ações para executar
      if (response.actions && response.actions.length > 0) {
        // Adiciona uma mensagem explicando o que será feito
        const actionMessage = {
          role: "assistant",
          content: `Vou ${response.actions[0].description}. Um momento por favor...`,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, actionMessage]);

        // Executa a ação localmente
        setActiveAction(response.actions[0]);
        const actionResult = await executeActionLocally(response.actions[0]);

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

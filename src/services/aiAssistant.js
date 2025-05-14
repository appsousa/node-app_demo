import axios from "axios";

// URL do backend
const API_URL =
  process.env.REACT_APP_API_URL || "https://codesandbox.io/p/devbox/8ch65k";
const AI_ENDPOINT = `${API_URL}/ai-assistant`;

/**
 * Envia uma mensagem para o assistente de IA
 * @param {string} message - Mensagem do usuário
 * @param {Array} history - Histórico de mensagens anteriores
 * @returns {Promise<Object>} - Resposta do assistente, possivelmente com ações a executar
 */
export const sendMessage = async (message, history) => {
  try {
    const response = await axios.post(`${AI_ENDPOINT}/message`, {
      message,
      history: history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao enviar mensagem para o assistente:", error);
    throw new Error(
      "Não foi possível processar sua mensagem. Por favor, tente novamente."
    );
  }
};

/**
 * Executa uma ação solicitada pelo assistente de IA
 * @param {Object} action - Detalhes da ação a ser executada
 * @returns {Promise<Object>} - Resultado da execução da ação
 */
export const executeAction = async (action) => {
  try {
    const response = await axios.post(`${AI_ENDPOINT}/execute-action`, {
      action,
    });

    const { success, message, result } = response.data;

    if (!success) {
      throw new Error(message || "Falha ao executar ação");
    }

    // Prepara o objeto de retorno com base no resultado recebido do backend
    return {
      success,
      message,
      navigate: result.navigate,
      updateAppState: result.updateAppState || {},
    };
  } catch (error) {
    console.error("Erro ao executar ação:", error);
    throw new Error(
      "Não foi possível executar a ação solicitada. Por favor, tente novamente."
    );
  }
};
